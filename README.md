# 简易个人记账 CLI（bookkeeping）

一个零依赖的 Python 命令行记账工具，使用本地 JSON 文件持久化记录。

## 环境要求

- Python 3.8+（仅使用标准库，无需 pip 安装依赖）

## 快速开始

```bash
# 直接运行（脚本已带可执行权限）
python3 bookkeeping/bookkeeping.py --help

# 或添加可执行权限后直接运行
chmod +x bookkeeping/bookkeeping.py
./bookkeeping/bookkeeping.py --help
```

默认数据文件：`~/.bookkeeping.json`。可通过 `--file` 参数或环境变量 `BOOKKEEPING_FILE` 指定其他路径（下面示例用临时文件演示，避免污染真实账本）。

## 命令一览

| 命令      | 说明                                     |
| --------- | ---------------------------------------- |
| `add`     | 记一笔收入/支出                          |
| `list`    | 按日期/分类筛选记录（默认日期倒序）      |
| `summary` | 月度汇总（总收入、总支出、结余、分类占比）|

### add —— 记一笔

必填：`amount`（正数）、`type`（`income`/`expense`）。
可选：`-c/--category`（默认 `other`）、`-n/--note`、`-d/--date`（默认当天，格式 `YYYY-MM-DD`）。

### list —— 查看记录

- 默认按日期倒序展示所有记录；
- `--from YYYY-MM-DD` / `--to YYYY-MM-DD` 按日期范围筛选（含边界）；
- `-c/--category <name>` 按分类精确筛选；
- 展示字段：date / type / amount（收入前缀 `+`、支出前缀 `-`）/ category / note，并附带合计。

### summary —— 月度汇总

- `-m/--month YYYY-MM` 指定月份，默认当前月；
- 输出总收入、总支出、结余；
- 按支出分类聚合金额与占比（百分比），并附简易可视化条。

## 输入校验

- 金额必须为正数（`> 0`），最多保留 2 位小数；
- 日期必须为 `YYYY-MM-DD`，月份必须为 `YYYY-MM`；
- 类型只能是 `income` 或 `expense`；
- JSON 文件损坏或格式错误时会给出明确提示，不会静默覆盖。

## 示例运行（以下输出为真实执行结果）

示例中通过 `--file /tmp/demo-book.json` 使用独立的临时数据文件，避免影响真实账本。

### 1) 记录若干笔收支

```bash
$ BK=/tmp/demo-book.json
$ rm -f $BK

$ python3 bookkeeping/bookkeeping.py --file $BK add 8000 income -c salary -n "10月工资" -d 2026-10-10
已记录一笔：
  日期：2026-10-10  类型：income  金额：+8000.00
  分类：salary  备注：10月工资
  存储：/tmp/demo-book.json  累计记录数：1

$ python3 bookkeeping/bookkeeping.py --file $BK add 35 expense -c food -n "午饭" -d 2026-10-10
已记录一笔：
  日期：2026-10-10  类型：expense  金额：-35.00
  分类：food  备注：午饭
  存储：/tmp/demo-book.json  累计记录数：2

$ python3 bookkeeping/bookkeeping.py --file $BK add 1200 expense -c rent -n "房租" -d 2026-10-01
已记录一笔：
  日期：2026-10-01  类型：expense  金额：-1200.00
  分类：rent  备注：房租
  存储：/tmp/demo-book.json  累计记录数：3

$ python3 bookkeeping/bookkeeping.py --file $BK add 89.9 expense -c food -n "聚餐" -d 2026-10-15
已记录一笔：
  日期：2026-10-15  类型：expense  金额：-89.90
  分类：food  备注：聚餐
  存储：/tmp/demo-book.json  累计记录数：4

$ python3 bookkeeping/bookkeeping.py --file $BK add 45 expense -c transport -n "打车" -d 2026-10-12
已记录一笔：
  日期：2026-10-12  类型：expense  金额：-45.00
  分类：transport  备注：打车
  存储：/tmp/demo-book.json  累计记录数：5
```

### 2) 查看全部记录（默认按日期倒序）

```bash
$ python3 bookkeeping/bookkeeping.py --file $BK list
date        type            amount  category      note
------------------------------------------------------------------------
2026-10-15  expense         -89.90  food          聚餐
2026-10-12  expense         -45.00  transport     打车
2026-10-10  income        +8000.00  salary        10月工资
2026-10-10  expense         -35.00  food          午饭
2026-10-01  expense       -1200.00  rent          房租
------------------------------------------------------------------------
共 5 条  |  收入合计: +8000.00  |  支出合计: -1369.90  |  结余: +6630.10
```

### 3) 按日期范围 + 分类筛选

```bash
$ python3 bookkeeping/bookkeeping.py --file $BK list --from 2026-10-08 --to 2026-10-12 -c food
date        type            amount  category      note
------------------------------------------------------------------------
2026-10-10  expense         -35.00  food          午饭
------------------------------------------------------------------------
共 1 条  |  收入合计: +0.00  |  支出合计: -35.00  |  结余: -35.00
```

### 4) 月度汇总（按分类展示支出占比）

```bash
$ python3 bookkeeping/bookkeeping.py --file $BK summary -m 2026-10
2026-10 月度汇总
  总收入：+8000.00
  总支出：-1369.90
  结  余：+6630.10

支出分类占比：
  rent          1200.00   87.6%  ############################################
  food           124.90    9.1%  #####
  transport       45.00    3.3%  ##
```

### 5) 错误输入提示

```bash
$ python3 bookkeeping/bookkeeping.py --file $BK add -100 expense
usage: bookkeeping add [-h] [-c CATEGORY] [-n NOTE] [-d DATE]
                       amount {income,expense}
bookkeeping add: error: argument amount: 金额必须为正数，收到：-100

$ python3 bookkeeping/bookkeeping.py --file $BK add 50 unknown
usage: bookkeeping add [-h] [-c CATEGORY] [-n NOTE] [-d DATE]
                       amount {income,expense}
bookkeeping add: error: argument type: invalid choice: 'unknown' (choose from 'income', 'expense')

$ python3 bookkeeping/bookkeeping.py --file $BK add 50 expense -d 2026/10/10
usage: bookkeeping add [-h] [-c CATEGORY] [-n NOTE] [-d DATE]
                       amount {income,expense}
bookkeeping add: error: argument -d/--date: 日期格式错误，应为 YYYY-MM-DD，收到：2026/10/10
```

## 数据文件格式

`~/.bookkeeping.json` 为 JSON 数组，每条记录结构如下：

```json
[
  {
    "date": "2026-10-10",
    "type": "expense",
    "amount": 35.0,
    "category": "food",
    "note": "午饭"
  }
]
```

写入采用“临时文件 + 原子替换”策略，避免中途异常造成数据损坏。
