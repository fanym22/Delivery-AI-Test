#!/usr/bin/env python3
"""简易个人记账 CLI。

功能：
  - add     记一笔收入/支出
  - list    按日期/分类筛选并展示记录（默认按日期倒序）
  - summary 月度汇总（总收入、总支出、结余、各分类支出占比）

存储：
  - 默认使用 ~/.bookkeeping.json 保存所有记录（JSON 数组）。
  - 可通过环境变量 BOOKKEEPING_FILE 或全局 --file 指定其他路径。
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from collections import defaultdict
from dataclasses import dataclass, asdict
from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# 常量与默认配置
# ---------------------------------------------------------------------------

TYPES = ("income", "expense")
DATE_FMT = "%Y-%m-%d"
MONTH_FMT = "%Y-%m"
DEFAULT_CATEGORY = "other"
DEFAULT_DB_PATH = Path.home() / ".bookkeeping.json"
DECIMAL_Q = Decimal("0.01")


def resolve_default_db_path() -> Path:
    """按需解析默认数据文件路径，优先使用运行时环境变量。"""
    env_path = os.environ.get("BOOKKEEPING_FILE")
    return Path(env_path).expanduser() if env_path else DEFAULT_DB_PATH


# ---------------------------------------------------------------------------
# 数据结构与存储
# ---------------------------------------------------------------------------


@dataclass
class Record:
    """一条记账记录。

    金额统一用两位小数字符串对应的 Decimal 序列化展示，并以 float 兼容存储在 JSON 中；
    类型由 `type` 字段区分，展示/统计时再处理符号。
    """

    date: str        # YYYY-MM-DD
    type: str        # income | expense
    amount: float    # 正数
    category: str
    note: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @staticmethod
    def from_dict(raw: dict[str, Any], *, index: int) -> "Record":
        if not isinstance(raw, dict):
            raise ValueError(f"第 {index} 条记录不是对象")

        missing = [key for key in ("date", "type", "amount") if key not in raw]
        if missing:
            raise ValueError(f"第 {index} 条记录缺少必填字段：{', '.join(missing)}")

        rec_date = str(raw["date"])
        try:
            datetime.strptime(rec_date, DATE_FMT)
        except ValueError as exc:
            raise ValueError(f"第 {index} 条记录日期格式错误，应为 YYYY-MM-DD：{rec_date}") from exc

        rec_type = str(raw["type"])
        if rec_type not in TYPES:
            raise ValueError(f"第 {index} 条记录类型错误，仅支持 income/expense：{rec_type}")

        try:
            amount_dec = Decimal(str(raw["amount"])).quantize(DECIMAL_Q, rounding=ROUND_HALF_UP)
        except (InvalidOperation, ValueError) as exc:
            raise ValueError(f"第 {index} 条记录金额非法：{raw['amount']}") from exc
        if amount_dec <= 0:
            raise ValueError(f"第 {index} 条记录金额必须为正数：{raw['amount']}")

        category = str(raw.get("category", DEFAULT_CATEGORY) or DEFAULT_CATEGORY).strip() or DEFAULT_CATEGORY
        note = str(raw.get("note", "") or "")

        return Record(
            date=rec_date,
            type=rec_type,
            amount=float(amount_dec),
            category=category,
            note=note,
        )


def load_records(path: Path) -> list[Record]:
    """读取 JSON 文件；不存在时返回空列表；损坏或字段非法时直接报错。"""
    if not path.exists() or path.stat().st_size == 0:
        return []
    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        raise SystemExit(f"[错误] 数据文件损坏，无法解析 JSON：{path}\n  详情：{e}")
    if not isinstance(data, list):
        raise SystemExit(f"[错误] 数据文件格式错误，顶层应为数组：{path}")

    records: list[Record] = []
    for idx, item in enumerate(data, start=1):
        try:
            records.append(Record.from_dict(item, index=idx))
        except ValueError as e:
            raise SystemExit(f"[错误] 数据文件记录非法：{path}\n  详情：{e}")
    return records


def save_records(path: Path, records: list[Record]) -> None:
    """原子写入：先写临时文件再替换，避免中途异常导致数据丢失。"""
    path = path.expanduser()
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(
        prefix=path.name + ".",
        suffix=".tmp",
        dir=str(path.parent),
    )
    tmp_path = Path(tmp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump([r.to_dict() for r in records], f, ensure_ascii=False, indent=2)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp_path, path)
    except Exception:
        try:
            tmp_path.unlink()
        except FileNotFoundError:
            pass
        raise


# ---------------------------------------------------------------------------
# 校验辅助
# ---------------------------------------------------------------------------


def parse_positive_amount(raw: str) -> float:
    """解析金额，必须为正数；最多保留 2 位小数以贴近实际使用。"""
    try:
        value = Decimal(raw)
    except (InvalidOperation, ValueError):
        raise argparse.ArgumentTypeError(f"金额必须是数字，收到：{raw}")
    if value <= 0:
        raise argparse.ArgumentTypeError(f"金额必须为正数，收到：{raw}")
    try:
        value = value.quantize(DECIMAL_Q, rounding=ROUND_HALF_UP)
    except InvalidOperation:
        raise argparse.ArgumentTypeError(f"金额格式非法，最多保留两位小数，收到：{raw}")
    return float(value)


def parse_date(raw: str) -> date:
    """解析 YYYY-MM-DD 日期。"""
    try:
        return datetime.strptime(raw, DATE_FMT).date()
    except ValueError:
        raise argparse.ArgumentTypeError(f"日期格式错误，应为 YYYY-MM-DD，收到：{raw}")


def parse_month(raw: str) -> tuple[int, int]:
    """解析 YYYY-MM 月份，返回 (year, month)。"""
    try:
        dt = datetime.strptime(raw, MONTH_FMT)
    except ValueError:
        raise argparse.ArgumentTypeError(f"月份格式错误，应为 YYYY-MM，收到：{raw}")
    return dt.year, dt.month


# ---------------------------------------------------------------------------
# 子命令实现
# ---------------------------------------------------------------------------


def cmd_add(args: argparse.Namespace) -> int:
    rec = Record(
        date=args.date.strftime(DATE_FMT),
        type=args.type,
        amount=args.amount,
        category=(args.category or DEFAULT_CATEGORY).strip() or DEFAULT_CATEGORY,
        note=args.note or "",
    )
    records = load_records(args.file)
    records.append(rec)
    save_records(args.file, records)

    sign = "+" if rec.type == "income" else "-"
    print("已记录一笔：")
    print(f"  日期：{rec.date}  类型：{rec.type}  金额：{sign}{rec.amount:.2f}")
    print(f"  分类：{rec.category}  备注：{rec.note or '（无）'}")
    print(f"  存储：{args.file}  累计记录数：{len(records)}")
    return 0


def _parse_record_date(rec: Record) -> date:
    return datetime.strptime(rec.date, DATE_FMT).date()


def _matches_filter(rec: Record, start: date | None, end: date | None, category: str | None) -> bool:
    d = _parse_record_date(rec)
    if start and d < start:
        return False
    if end and d > end:
        return False
    if category and rec.category != category:
        return False
    return True


def cmd_list(args: argparse.Namespace) -> int:
    records = load_records(args.file)
    filtered = [
        r for r in records
        if _matches_filter(r, args.start_date, args.end_date, args.category)
    ]
    filtered.sort(key=lambda r: (_parse_record_date(r), r.to_dict().get("note", "")), reverse=True)

    if not filtered:
        print("（暂无符合条件的记录）")
        return 0

    header = f"{'date':<12}{'type':<10}{'amount':>12}  {'category':<14}note"
    print(header)
    print("-" * 72)
    total_income = 0.0
    total_expense = 0.0
    for r in filtered:
        sign = "+" if r.type == "income" else "-"
        note_display = r.note or "-"
        amount_str = f"{sign}{r.amount:.2f}"
        print(f"{r.date:<12}{r.type:<10}{amount_str:>12}  {r.category:<14}{note_display}")
        if r.type == "income":
            total_income += r.amount
        else:
            total_expense += r.amount

    print("-" * 72)
    print(
        f"共 {len(filtered)} 条  |  收入合计: +{total_income:.2f}  "
        f"|  支出合计: -{total_expense:.2f}  |  结余: {total_income - total_expense:+.2f}"
    )
    return 0


def cmd_summary(args: argparse.Namespace) -> int:
    records = load_records(args.file)
    year, month = args.month

    month_records = [r for r in records if _parse_record_date(r).year == year and _parse_record_date(r).month == month]

    total_income = sum(r.amount for r in month_records if r.type == "income")
    total_expense = sum(r.amount for r in month_records if r.type == "expense")
    balance = total_income - total_expense

    expense_by_cat: dict[str, float] = defaultdict(float)
    for r in month_records:
        if r.type == "expense":
            expense_by_cat[r.category] += r.amount

    title_month = f"{year:04d}-{month:02d}"
    print(f"{title_month} 月度汇总")
    print(f"  总收入：+{total_income:.2f}")
    print(f"  总支出：-{total_expense:.2f}")
    print(f"  结  余：{balance:+.2f}")

    if not expense_by_cat:
        print("\n本月暂无支出，不展示分类占比。")
        return 0

    print("\n支出分类占比：")
    for cat, amt in sorted(expense_by_cat.items(), key=lambda kv: kv[1], reverse=True):
        pct = (amt / total_expense * 100) if total_expense > 0 else 0
        bar = "#" * max(int(round(pct / 2)), 1 if pct > 0 else 0)
        print(f"  {cat:<12} {amt:>8.2f}  {pct:5.1f}%  {bar}")
    return 0


# ---------------------------------------------------------------------------
# 参数解析
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="bookkeeping",
        description="简易个人记账 CLI（本地 JSON 持久化）",
    )
    parser.add_argument(
        "--file",
        type=Path,
        default=None,
        help=f"数据文件路径，默认 {DEFAULT_DB_PATH}（也可用 BOOKKEEPING_FILE 环境变量覆盖）",
    )

    sub = parser.add_subparsers(dest="command", required=True, metavar="<command>")

    p_add = sub.add_parser("add", help="记一笔收入/支出")
    p_add.add_argument("amount", type=parse_positive_amount, help="金额（必须为正数）")
    p_add.add_argument("type", choices=TYPES, help="类型：income=收入，expense=支出")
    p_add.add_argument("-c", "--category", default=DEFAULT_CATEGORY, help=f"分类，默认 {DEFAULT_CATEGORY}")
    p_add.add_argument("-n", "--note", default="", help="备注（可选）")
    p_add.add_argument(
        "-d", "--date",
        type=parse_date,
        default=date.today(),
        help=f"日期，格式 YYYY-MM-DD，默认当天（{date.today().strftime(DATE_FMT)}）",
    )
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list", help="查看记录（默认日期倒序，支持筛选）")
    p_list.add_argument("--from", dest="start_date", type=parse_date, default=None, help="起始日期 YYYY-MM-DD（含）")
    p_list.add_argument("--to", dest="end_date", type=parse_date, default=None, help="结束日期 YYYY-MM-DD（含）")
    p_list.add_argument("-c", "--category", default=None, help="按分类精确筛选")
    p_list.set_defaults(func=cmd_list)

    p_sum = sub.add_parser("summary", help="月度汇总")
    p_sum.add_argument(
        "-m", "--month",
        type=parse_month,
        default=(date.today().year, date.today().month),
        help=f"月份 YYYY-MM，默认当前月（{date.today().strftime(MONTH_FMT)}）",
    )
    p_sum.set_defaults(func=cmd_summary)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.file is None:
        args.file = resolve_default_db_path()
    args.file = Path(args.file).expanduser()
    return args.func(args)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n已取消。")
        sys.exit(130)
