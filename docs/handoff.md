# 项目交接文档（给 AI 助手读）

> 用途：新开一个 AI 会话时，把本文件全文贴给它，它就能了解我是谁、在做什么、做到哪了。
> 更新频率：每周结束更新「当前进度」和「下一步」两节。
> 最后更新：2026-09-06（第 1 周结束）

## 1. 我是谁

前端工程师，主做金融借贷类 App 内嵌 H5（React + TypeScript + Vite + antd-mobile）。

已有经验：

- Hybrid 桥接：flutter_inappwebview、iOS WKWebView messageHandlers、Android 暴露方法，callbackId 异步回调和直接返回两种模式都用过，做过按 App 版本兼容 Bridge 的修复和回滚
- 公参/token 通过 Bridge 实时获取，在 axios 拦截器注入，不落地存储
- 性能：App 首装弱网首屏 40s，通过 lazy + Suspense + Vite 图片压缩优化到 6s 以内
- 监控：因 Sentry SDK 过大，改用 GlitchTip 做线上错误监控
- 熟悉 Git、CI/CD

## 2. 目标

12 个月内从「Hybrid H5 前端」成长为 **「Hybrid 前端稳定性 + AI 应用全栈」** 方向的工程师。

求职定位：高级前端 / Hybrid 前端工程师为主，AI 应用前端/全栈为转型方向。

学习深度标准：核心方向达到「独立交付」（能设计、实现、测试、部署、排障、说明取舍），不追求源码级精通。

## 3. 仓库结构

```text
hybrid-ai-lab/
├── README.md              # 总计划 + 每周进度
├── docs/
│   ├── plan.md            # 12 个月详细计划、每阶段验收标准（最重要的参考）
│   ├── handoff.md         # 本文件
│   ├── bridge/
│   │   └── inventory.md   # 第 1 周产出：现有 8 个客户端 Bridge 实现的梳理
│   ├── perf/
│   └── retros/
├── bridge-methods/        # 原项目 8 个客户端的 Bridge 代码快照，只读参考，不修改
│   ├── android-one/ android-two/ android-three/
│   └── ios-one/ ios-two/ ios-three/ ios-four/ ios-five/
├── bridge-sdk/            # 阶段一产出（待开始编码）
├── perf-report/           # 阶段二
├── nest-service/          # 阶段三
├── ai-assistant/          # 阶段四
└── notes/
```

## 4. 阶段计划

| 阶段 | 周期 | 内容 | 产出 | 状态 |
|---|---|---|---|---|
| 1 | 第 1-4 周 | Bridge SDK 平台化 | `bridge-sdk/` + 协议文档 | **进行中，第 1 周完成** |
| 2 | 第 5-6 周 | 性能优化数据补齐 | `docs/perf/report.md` | 待开始 |
| 3 | 第 7 周起约 3 月 | NestJS + PostgreSQL + Prisma + Redis + Docker | 可部署后端 | 待开始 |
| 4 | 第 8-10 月 | SSE 流式对话 -> Tool Calling -> RAG（pgvector） | `ai-assistant/` | 待开始 |
| 5 | 第 11-12 月 | 整合上线、复盘、求职材料 | 在线 Demo + 架构图 | 待开始 |

阶段一周计划：

- 第 1 周 梳理现状 -> `docs/bridge/inventory.md` **已完成**
- 第 2 周 协议与类型设计 -> `docs/bridge/protocol.md` **下一步**
- 第 3 周 核心实现 + Vitest
- 第 4 周 接入真实项目、日志脱敏、README、时序图

## 5. 当前进度（第 1 周完成）

已读取 `bridge-methods/` 全部 24 个文件，产出 `docs/bridge/inventory.md`，关键结论：

**发现 5 种协议并存**：

| 协议 | 客户端 |
|---|---|
| webkit-callback（`webkit.messageHandlers[name].postMessage` + callbackId） | ios-one、ios-two、ios-four |
| flutter-callback（`callHandler(name, {action,data,callbackId})` + ready 事件等待） | ios-one `WebViewBridge_two.ts` |
| flutter-direct（`await callHandler(action, msg)` 直接返 Promise） | ios-three、ios-five、android-one、android-three |
| scheme-intercept（`location.href = "getPublicParams://..."`） | android-one |
| exposed-sync（`window.PesoFunny.*`、`window.PG_Finance.*`） | android-two、android-three |

**10 个业务能力**：uploadRiskLoan、openUrl、openGooglePlay、closeSyn、jumpToHome、toGrade、changeAccount、setTitle、retryOrderDialog、getPublicParams。每个 App 的 action 名和参数键都是独立混淆的（`nexa_way_*`、`pera_rise_*`、`sure_vida_*`、`vera_point_*`、`yes_peso_*`）。

**主要风险**：所有 callback 协议无超时；公参在 axios 拦截器中 `await`，Native 不回调则请求永久挂起；scheme-intercept 并发丢失；flutter-direct 错误处理不一致（有的 reject 有的吞成 undefined）；`window[bridgeName] = this` 无冲突检查。

**已决定的方案**（inventory.md 第七、八节）：

- 业务代码只用规范方法名，per-App 配置表映射混淆 action 和参数键
- 5 种协议各一个 adapter，对外统一 Promise
- 每次调用带 timeout，统一错误类型 `TIMEOUT / UNSUPPORTED / NOT_READY / NATIVE_ERROR / INVALID_RESPONSE`
- 版本兼容用能力探测替代版本号：运行时探测全局对象 -> 从公参返回值读 appVersion -> 配置表 `minAppVersion` + 远程 `disabledMethods` 开关（开关即回滚手段）
- 每个方法声明 fallback，只有 getPublicParams 是阻断性的
- 公参 5-10s 内存 TTL 缓存 + 并发合并，不落地，回前台清缓存
- 浏览器环境走 Mock，不抛错不挂起
- 调用日志脱敏后上报 GlitchTip

## 6. 下一步（第 2 周）

产出 `docs/bridge/protocol.md` 和 `bridge-sdk/src/types.ts`，内容：

1. `BridgeMethods` 类型：10 个规范方法的 params / result 类型
2. `BridgeError` 类：5 种错误码
3. `call<M>(method, params?, options?)` 签名，options 含 `timeout`、`minAppVersion`、`fallback`
4. per-App 配置表的类型：`{ appId, adapter, actions: Record<Method, { action, paramKeys }> }`
5. Adapter 接口：`{ detect(): boolean; call(action, payload, callbackId?): Promise<unknown> }`
6. 协议文档表格：方法名、参数、返回、错误码、超时、fallback、是否含敏感信息

第 2 周不写实现，只写类型和文档。

## 7. 约束（请遵守）

- 不修改 `bridge-methods/` 下任何文件，它们是只读参考
- 阶段三技术栈固定为 NestJS + PostgreSQL + Prisma + Redis + Docker，不引入 GraphQL / 微服务 / Kafka / K8s / MongoDB
- 阶段四向量库只用 pgvector，不同时学其他向量库
- 不做：React 源码、Next.js 高级特性、LangChain 全部模块、多智能体、模型微调、Flutter UI、React Native
- 一次只做一个项目，不并行开新项目
- 每周结束在 `README.md` 写 10 行以内进度，同时更新本文件第 5、6 节

## 8. 如何帮我

- 提问先读 `docs/plan.md` 对应阶段的「学习到什么程度」和「验收问题」，按那个深度回答，不要过度展开
- 设计方案时对照 `docs/bridge/inventory.md` 的真实代码差异，不要假设理想化的 Bridge
- 写代码前先给类型和接口，我确认后再实现
- 我在职学习，工作日每天 1-1.5 小时，周末各 3 小时，给任务时按这个时间量拆
