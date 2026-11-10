# RecruitHub 招聘管理后台 — 首版前端原型

本目录为"招聘系统前端页面"在需求澄清/AI-Spec 阶段产出的静态可预览原型，对应 PRD: `docs/recruitment-system/spec.md`。

## 快速预览

直接用浏览器打开 `index.html` 即可（无需任何构建）。

```bash
# 或用任意静态服务器
cd frontend/recruitment-portal
python3 -m http.server 8080
# 打开 http://localhost:8080
```

- 任意合法格式的账号/密码均可登录（输入密码 `wrong` 可查看错误态）。
- 所有数据为前端 mock，保存在内存；刷新页面会重置。

## 页面清单（核心 5 页）

| 页面 | Hash 路由 | 说明 |
|---|---|---|
| 登录 | `#/login` | 品牌区 + 登录表单 + 错误态 |
| 职位列表 | `#/jobs` | 搜索/筛选、状态 Tag、行内编辑/上下架/关闭 |
| 新建职位 | `#/jobs/new` | 基础信息 + JD，保存草稿/发布 |
| 编辑职位 | `#/jobs/:id/edit` | 数据回填、未保存离开拦截 |
| 候选人看板 | `#/jobs/:id/board` | Kanban 7 列、拖拽推进、右侧抽屉预览 |
| 候选人详情 | `#/candidates/:id` | 简历信息 + 时间线 + 推进/淘汰/添加备注 |

## 设计

- 视觉风格: 专业商务蓝（主色 `#1F5FEB`）
- 适配: 仅桌面端（≥1280px）
- 技术: 原生 HTML + CSS + JS（hash 路由），无外部依赖
- 设计/验收说明见 `design-notes.md`

## 下游注意

- 本原型为交互/视觉基线，mock 数据与字段命名仅用于演示，不构成正式 API 契约。
- 真实接口字段、权限模型、简历解析、日历/邮件对接等待后续节点确认（详见 PRD `Open Questions`）。
