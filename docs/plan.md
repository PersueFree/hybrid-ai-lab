# 12 个月学习计划

## 深度标准

| 等级 | 表现 | 是否目标 |
|---|---|---|
| 了解 | 看过概念，能跟教程使用 | 不够 |
| 熟练使用 | 能按文档开发功能 | 次要技术 |
| 独立交付 | 能设计、实现、测试、部署、排障、说明取舍 | 核心方向 |
| 深入掌握 | 源码级，解决框架级问题 | 不作为目标 |

## 统一验收标准

每个阶段结束用这 5 个问题验收，而不是「课程看完了」：

1. 不看教程只查官方文档，能否从零完成核心功能？
2. 能否讲清楚为什么这样设计？
3. 能否处理超时、重试、取消、重复请求、版本不兼容、权限不足、网络中断？
4. 能否为核心逻辑写测试并模拟异常？
5. 能否让别人运行起来，并根据日志定位问题？

---

## 阶段一：Bridge SDK（第 1-4 周）

### 目标

从「会调用 Bridge」升级为「能设计跨 Flutter / iOS / Android 的 H5 通信协议」。

### 三层结构

```text
业务层   bridge.getToken()
协议层   callbackId / direct return / exposed method
端适配层 Flutter InAppWebView / WKWebView / Android JavascriptInterface / Web Mock
```

### 周计划

- **第 1 周 梳理现状**：列出现有项目所有 Bridge 方法，三端协议、版本限制、历史问题，输出 `docs/bridge/inventory.md`
- **第 2 周 协议与类型**：方法到参数/返回的类型映射、`BridgeError` 错误码、`call` 签名，输出 `docs/bridge/protocol.md`
- **第 3 周 核心实现**：callbackId 生成与超时清理、重复回调防护、能力探测、版本比较与降级、Web Mock，Vitest 覆盖异常路径
- **第 4 周 接入收尾**：接入真实项目一个页面、调用日志脱敏、README、时序图

### 验收问题

- 超时后 Native 又回调了怎么办？
- H5 比 App 新，App 不支持新方法时如何降级？
- 如何区分 Bridge 错误、接口错误、业务错误？
- Native 重复回调如何防护？
- Token 通过 Bridge 传输时如何减少泄露风险？

---

## 阶段二：性能报告（第 5-6 周）

### 目标

把已有的「弱网 40s -> 6s」成果补成有数据、有口径的报告。不做新优化。

### 内容

- Performance API 采集 FCP / LCP / TTFB / 资源加载
- Vite 产物分析，包体积前后对比
- 明确 6s 的统计口径（平均 / P75 / P95）
- 输出 `docs/perf/report.md`：原始问题、优化前指标、定位过程、方案、优化后指标、副作用、后续监控

---

## 阶段三：NestJS 服务（第 7 周起，约 3 个月）

### 技术栈（固定，不扩展）

NestJS + PostgreSQL + Prisma + Redis + Docker

本阶段不碰：GraphQL、微服务、Kafka、K8s、MongoDB。

### 掌握程度

- NestJS：Module / Controller / Service / DTO / Guard / Interceptor / Exception Filter / 配置 / 日志 / 测试
- PostgreSQL：表设计、索引、分页、事务、唯一约束、基础慢查询排查
- Redis：缓存、TTL、限流、幂等键、简单分布式锁
- 安全：JWT、Refresh Token、RBAC、参数校验、脱敏、审计日志

### 产出

带登录、用户、角色、权限、知识库文档、会话、审计日志的后端；Docker 一键启动；CI 自动测试构建；在线部署。

### 验收问题

- 为什么这个字段建索引？
- 哪些操作必须放在事务里？
- 如何避免用户读取其他租户数据？
- 接口重复提交如何保证幂等？
- 如何定位一个接口变慢？

---

## 阶段四：AI 应用（第 8-10 月）

### 4.1 流式对话

SSE、流式解析、中断、超时、重试、降级、Token 统计、上下文管理。
前端：Markdown 渲染、停止/重新生成、历史会话、状态展示（生成中/已停止/失败/完成）。

### 4.2 Tool Calling

只做 2-3 个低风险工具：`queryRepaymentPlan`、`queryLoanStatus`、`createCustomerServiceTicket`。
原则：模型只提出调用请求，执行必须经后端权限和参数校验。高风险操作需用户确认。

### 4.3 RAG

链路：上传 -> 提取 -> 切分 -> Embedding -> pgvector 存储 -> 检索 -> 拼接 -> 回答 -> 引用来源。
只用 PostgreSQL + pgvector，不同时学其他向量库。
必须做到：无答案时拒答、按角色隔离知识库、引用来源。

### 验收问题

- SSE 和 WebSocket 区别，客户端断开如何处理？
- 如何防止模型构造非法参数或越权访问订单？
- Chunk 太大或太小有什么问题？
- 知识库更新后如何避免旧内容被召回？

---

## 阶段五：整合与求职（第 11-12 月）

### 最终产出

1. 在线 Demo
2. Git 仓库
3. 系统架构图
4. Bridge 调用时序图
5. 性能优化报告
6. 技术复盘 `docs/retros/final.md`

### 复盘必答

- 为什么选这个技术栈？哪些地方刻意没用更复杂的方案？
- 系统瓶颈在哪？流量扩大十倍先改哪里？
- AI 输出不可靠时怎么办？哪些功能不能交给模型？
- 如何保护金融敏感数据？
- 如何灰度发布和快速回滚？

---

## 暂不深入

React 源码、Next.js 高级特性、LangChain 全部模块、多智能体、模型微调、K8s、微服务、Kafka、Flutter UI、原生业务开发、React Native。
