# hybrid-ai-lab

12 个月学习与项目仓库。目标：从 Hybrid H5 前端，成长为 **Hybrid 前端稳定性 + AI 应用全栈** 方向的工程师。

学习深度统一标准：核心方向达到「独立交付」（能设计、实现、测试、部署、排障），不追求源码级精通。

## 目录

```text
hybrid-ai-lab/
├── README.md          # 总计划 + 每周进度记录
├── docs/
│   ├── bridge/        # Bridge 协议文档、时序图
│   ├── perf/          # 性能优化报告
│   └── retros/        # 阶段复盘
├── notes/             # 零散学习笔记
├── bridge-sdk/        # 阶段一：Bridge SDK（第 1-4 周）
├── perf-report/       # 阶段二：性能数据采集脚本（第 5-6 周）
├── nest-service/      # 阶段三：NestJS + PostgreSQL + Redis（第 7 周起）
└── ai-assistant/      # 阶段四：AI 应用（SSE / Tool Calling / RAG）
```

各子项目相互独立，各自有 `package.json`。等 `ai-assistant` 需要引用 `bridge-sdk` 时再考虑 monorepo。

## 阶段计划

| 阶段 | 周期 | 内容 | 产出 | 状态 |
|---|---|---|---|---|
| 1 | 第 1-4 周 | Bridge SDK 平台化 | `bridge-sdk/` + `docs/bridge/` 协议文档 | 进行中 |
| 2 | 第 5-6 周 | 性能优化数据补齐 | `docs/perf/` 优化报告 | 待开始 |
| 3 | 第 7 周起 | NestJS + PostgreSQL + Redis + Docker | `nest-service/` 可部署服务 | 待开始 |
| 4 | 第 8-10 月 | SSE 流式对话 -> Tool Calling -> RAG | `ai-assistant/` | 待开始 |
| 5 | 第 11-12 月 | 整合上线、复盘、求职材料 | 在线 Demo + 架构图 + `docs/retros/` | 待开始 |

详细的每阶段目标和验收标准见 [docs/plan.md](docs/plan.md)。

## 每周进度

每周结束写 10 行以内：做了什么、卡在哪里、下周做什么。

### Week 1

- 做了：
- 卡点：
- 下周：
