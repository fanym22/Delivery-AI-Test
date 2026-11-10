#!/usr/bin/env python3
"""bookkeeping CLI 的基础功能验证。"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "bookkeeping.py"


def run(*args: str, db_path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), "--file", str(db_path), *args],
        capture_output=True,
        text=True,
        check=False,
    )


class BookkeepingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db = Path(self.temp_dir.name) / "bookkeeping.json"

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_add_list_summary_and_persistence(self) -> None:
        add1 = run("add", "8000", "income", "-c", "salary", "-n", "工资", "-d", "2026-10-10", db_path=self.db)
        self.assertEqual(add1.returncode, 0, add1.stderr)
        add2 = run("add", "35.5", "expense", "-c", "food", "-n", "午饭", "-d", "2026-10-10", db_path=self.db)
        self.assertEqual(add2.returncode, 0, add2.stderr)
        add3 = run("add", "1200", "expense", "-c", "rent", "-n", "房租", "-d", "2026-10-01", db_path=self.db)
        self.assertEqual(add3.returncode, 0, add3.stderr)

        data = json.loads(self.db.read_text(encoding="utf-8"))
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]["type"], "income")

        list_out = run("list", "--from", "2026-10-01", "--to", "2026-10-10", db_path=self.db)
        self.assertEqual(list_out.returncode, 0, list_out.stderr)
        self.assertIn("结余: +6764.50", list_out.stdout)
        self.assertIn("food", list_out.stdout)

        summary_out = run("summary", "-m", "2026-10", db_path=self.db)
        self.assertEqual(summary_out.returncode, 0, summary_out.stderr)
        self.assertIn("总收入：+8000.00", summary_out.stdout)
        self.assertIn("总支出：-1235.50", summary_out.stdout)
        self.assertIn("rent", summary_out.stdout)

    def test_invalid_inputs_and_corrupted_file(self) -> None:
        bad_amount = run("add", "-1", "expense", db_path=self.db)
        self.assertNotEqual(bad_amount.returncode, 0)
        self.assertIn("金额必须为正数", bad_amount.stderr)

        bad_type = run("add", "50", "unknown", db_path=self.db)
        self.assertNotEqual(bad_type.returncode, 0)
        self.assertIn("invalid choice", bad_type.stderr)

        bad_date = run("add", "50", "expense", "-d", "2026/10/10", db_path=self.db)
        self.assertNotEqual(bad_date.returncode, 0)
        self.assertIn("日期格式错误", bad_date.stderr)

        self.db.write_text("[{\"date\":\"bad\",\"type\":\"expense\",\"amount\":10}]", encoding="utf-8")
        bad_file = run("list", db_path=self.db)
        self.assertNotEqual(bad_file.returncode, 0)
        self.assertIn("数据文件记录非法", bad_file.stderr)


if __name__ == "__main__":
    unittest.main()
