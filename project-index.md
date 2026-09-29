# Project Index — Demo 展示项目

## 项目定位

本仓库用于存放面向客户演示的 Demo。当前首个 Demo 为物业公司 BI 运营大屏，代码位于 `BI-demo/`。

## 执行约束

- Python 操作必须在 Conda `demo` 环境中执行；当前机器尚未创建该环境。
- 修改文件前先列出 3 点计划，任务结束必须运行验证。
- `.agent/workflows/` 用于维护 Agent 与人员可读的项目文档。
- `milestone/YYYY-MM-DD.md` 用于记录每日工作。
- IP、API Key、Token 等敏感信息仅可存放在 `.env`，并由 `.gitignore` 排除。
- 新增第三方依赖前须获得用户确认。

## 技术栈

| 类别 | 技术 | 备注 |
| --- | --- | --- |
| 前端 | HTML5 / CSS3 / 原生 JavaScript | 零运行时依赖 |
| 图形 | CSS / 内联 SVG | 数据图表与地图示意 |
| 部署 | 静态文件托管 | 可直接由任意 Web Server 提供 |

## 目录结构

```text
.
├── BI-demo/
│   ├── UI.png
│   ├── logo.png
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .agent/workflows/
├── milestone/
├── project-index.md
└── project-overview.md
```

## 常用命令

```shell
# 直接用浏览器打开
open BI-demo/index.html

# 或使用任意静态文件服务器在仓库根目录提供服务
```
