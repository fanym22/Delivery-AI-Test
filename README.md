# 简易个人记账 CLI（bookkeeping）

一个零依赖的 Python 命令行记账工具，使用本地 JSON 文件持久化记录，适合在终端快速记录日常收支。

## 环境要求

- Python 3.8+（仅使用标准库，无需 pip 安装第三方依赖）

## 快速开始

```bash
python3 bookkeeping/bookkeeping.py --help
```

如需直接执行，可先赋予脚本可执行权限：

```bash
chmod +x bookkeeping/bookkeeping.py
./bookkeeping/bookkeeping.py --help
```

默认数据文件：`~/.bookkeeping.json`。
可通过全局参数 `--file <path>` 或环境变量 `BOOKKEEPING_FILE` 指定其他数据文件路径，方便测试或维护多个账本。

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `add` | 添加一笔收入或支出记录 |
| `list` | 查询记录，支持按时间范围、分类筛选，并展示合计统计 |
| `summary` | 查看月度总收入、总支出、结余及支出分类占比 |

### 1. add：记录收支

```bash
python3 bookkeeping/bookkeeping.py add <amount> {income,expense} [-c category] [-n note] [-d YYYY-MM-DD]
```

参数说明：
- `amount`：必填，正数金额，最多保留两位小数
- `type`：必填，`income` 表示收入，`expense` 表示支出
- `-c, --category`：可选，分类，默认 `other`
- `-n, --note`：可选，备注
- `-d, --date`：可选，日期，格式 `YYYY-MM-DD`，默认当天

示例：

```bash
python3 bookkeeping/bookkeeping.py add 35 expense -c food -n "午饭" -d 2026-11-10
python3 bookkeeping/bookkeeping.py add 8000 income -c salary -n "11月工资"
```

成功后会输出记录详情、存储路径和当前累计记录数。

### 2. list：查询记录与统计

```bash
python3 bookkeeping/bookkeeping.py list [--from YYYY-MM-DD] [--to YYYY-MM-DD] [-c category]
```

- 默认展示全部记录，按日期倒序输出
- `--from` / `--to`：按日期闭区间筛选
- `-c, --category`：按分类精确匹配
- 输出包含：日期、类型、金额（收入 `+`、支出 `-`）、分类、备注
- 结果末尾展示：记录数、收入合计、支出合计、结余

示例：

```bash
python3 bookkeeping/bookkeeping.py list
python3 bookkeeping/bookkeeping.py list --from 2026-11-01 --to 2026-11-30 -c food
```

当没有符合条件的记录时，会输出“暂无符合条件的记录”的提示。

### 3. summary：月度汇总

```bash
python3 bookkeeping/bookkeeping.py summary [-m YYYY-MM]
```

- 默认统计当前月份
- `-m, --month`：指定统计月份，格式 `YYYY-MM`
- 输出包含：总收入、总支出、结余
- 若当月有支出，还会按支出分类展示金额、占比和简易条形图

示例：

```bash
python3 bookkeeping/bookkeeping.py summary -m 2026-11
```

## 错误提示与可靠性

- 金额必须为正数，日期必须为 `YYYY-MM-DD`，月份必须为 `YYYY-MM`，类型仅支持 `income/expense`
- 参数错误时会直接指出错误字段和正确格式
- 数据文件不存在时首次写入会自动创建
- 写入采用临时文件 + 原子替换策略，尽量避免异常中断导致文件损坏
- 数据文件 JSON 损坏、顶层结构错误或单条记录字段非法时，会明确报错并停止，不会静默覆盖已有数据
- 用户中断命令时会以非零状态退出

## 数据格式

数据文件为 JSON 数组，每条记录结构如下：

```json
[
  {
    "date": "2026-11-10",
    "type": "expense",
    "amount": 35.0,
    "category": "food",
    "note": "午饭"
  }
]
```

## 本地验证

仓库附带基础测试脚本，可快速验证核心功能：

```bash
python3 bookkeeping/test_bookkeeping.py
```

建议使用临时文件进行体验，避免污染真实账本：

```bash
BK=/tmp/demo-book.json
rm -f $BK
python3 bookkeeping/bookkeeping.py --file $BK add 8000 income -c salary -n "工资" -d 2026-10-10
python3 bookkeeping/bookkeeping.py --file $BK add 35 expense -c food -n "午饭" -d 2026-10-10
python3 bookkeeping/bookkeeping.py --file $BK list
python3 bookkeeping/bookkeeping.py --file $BK summary -m 2026-10
```
