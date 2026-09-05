# Bridge 方法梳理（第 1 周）

梳理当前项目所有 H5 调用 Native 的方法。不写代码，只填表。

## 协议类型说明

- `callback`：H5 传 callbackId，Native 通过 handleMessage 回调
- `direct`：Native 直接返回 Promise 结果（flutter_inappwebview callHandler）
- `exposed`：Android 直接暴露同步方法，如 `AppBridge.getToken()`

## 方法清单

| 方法名 | 参数 | 返回 | Flutter | iOS | Android | 最低 App 版本 | 已知问题 / 修复回滚记录 |
|---|---|---|---|---|---|---|---|
| getToken | - | `{ token }` | | | exposed | | |
| | | | | | | | |

## 历史线上问题

| 日期 | 现象 | 根因 | 影响版本 | 处理方式 |
|---|---|---|---|---|
| | | | | |

## 梳理后的结论

- 哪些方法三端协议不一致：
- 哪些方法有版本分叉：
- SDK 必须优先解决的问题：
