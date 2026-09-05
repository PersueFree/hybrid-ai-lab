# Bridge 方法梳理（第 1 周）

来源：`bridge-methods/` 下 8 个客户端目录（android-one/two/three、ios-one/two/three/four/five），只读分析，未改动源码。

## 一、发现的 5 种协议

| 协议               | 调用方式                                                                                                            | Native 回调入口                                                | 出现在                                                     |
|--------------------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|------------------------------------------------------------|
| `webkit-callback`  | `window.webkit.messageHandlers[bridgeName].postMessage(JSON.stringify({action, data, callbackId}))`                 | Native 调 `window[bridgeName].handleMessage(...)`              | ios-one、ios-two、ios-four                                 |
| `flutter-callback` | `flutter_inappwebview.callHandler(bridgeName, {action, data, callbackId})`，等待 `flutterInAppWebViewPlatformReady` | Native 调 `window[bridgeName].handleMessage(obj)`              | ios-one（`WebViewBridge_two.ts`，对 Flutter 初始化的补充） |
| `flutter-direct`   | `await flutter_inappwebview.callHandler(action, message)`，Promise 直接返回结果                                     | 无，返回值即结果                                               | ios-three、ios-five、android-one、android-three            |
| `scheme-intercept` | `window.location.href = "getPublicParams://pera_snap?data=..&callbackId=.."`，Native 拦截 URL                       | Native 调 `window.getParams.handleMessage({data, callbackId})` | android-one、android-two（android-two 中已弃用）           |
| `exposed-sync`     | Android `@JavascriptInterface` 直接暴露：`window.PesoFunny.mark()`、`window.PG_Finance.getSession()`                | 无，同步/Promise 返回                                          | android-two（apiClient）、android-three                    |

同一客户端内混用情况：

- **ios-one**：webkit-callback + flutter-callback 两套并存
- **android-one**：getPublicParams 走 scheme-intercept，encode/decode 走 flutter-direct
- **android-two**：`WebViewBridge.ts` 定义了 scheme-intercept，但 `apiClient.ts:43-44` 实际用 exposed-sync `PG_Finance`，旧实现已注释（`apiClient.ts:84-91`）
- **android-three**：业务动作走 exposed-sync `PesoFunny.*`，getPublicParams 走 flutter-direct

## 二、客户端 x 协议矩阵

| 客户端        | bridgeName / 全局对象 | 业务动作协议      | getPublicParams 协议             | 加解密                                 | 关键文件                                   |
|---------------|-----------------------|-------------------|----------------------------------|----------------------------------------|--------------------------------------------|
| ios-one       | `ph_nexa_way_ios`     | webkit-callback   | webkit-callback（callback 参数） | -                                      | `WebViewBridge.ts`、`WebViewBridge_two.ts` |
| ios-two       | `ph_pera_rise_ios`    | webkit-callback   | webkit-callback，已包成 Promise  | -                                      | `WebViewBridge.ts`（有 `destroy()`）       |
| ios-three     | -                     | flutter-direct    | flutter-direct                   | -                                      | `FlutterView.js`                           |
| ios-four      | `ph_nexa_way_ios`     | webkit-callback   | webkit-callback（callback 参数） | -                                      | 与 ios-one 完全相同，缺 `_two`             |
| ios-five      | -                     | flutter-direct    | flutter-direct                   | -                                      | `FlutterView.ts`                           |
| android-one   | `getParams`           | -（目录内未提供） | scheme-intercept                 | flutter-direct `PesoEasyEncode/Decode` | `WebViewBridge.ts`、`apiClient.ts`         |
| android-two   | `PG_Finance`          | -（目录内未提供） | exposed-sync `getSession(url)`   | exposed-sync `encodeData/decodeData`   | `apiClient.ts`                             |
| android-three | `PesoFunny`           | exposed-sync      | flutter-direct                   | -                                      | `nativeInteraction.ts`                     |

## 三、能力 x 客户端矩阵

`Y` 有，`-` 无。action 名称按 App 混淆前缀区分（`nexa_way_*`、`pera_rise_*`、`sure_vida_*`、`vera_point_*`、`yes_peso_*`）。

| 能力             | ios-one           | ios-two      | ios-three         | ios-four   | ios-five  | android-three                 | 备注                                                      |
|------------------|-------------------|--------------|-------------------|------------|-----------|-------------------------------|-----------------------------------------------------------|
| uploadRiskLoan   | Y                 | Y            | Y                 | Y          | Y         | Y `PesoFunny.mark`            | 参数键每端不同                                            |
| openUrl          | Y `(url, single)` | Y `(appPkg)` | Y `(url, single)` | Y          | Y         | Y `navHost(url, single ?? 0)` | ios-two 签名不同；android-three 默认值 0，其余默认 1      |
| openGooglePlay   | -                 | Y            | Y                 | -          | Y         | -                             |                                                           |
| closeSyn         | Y                 | Y            | Y                 | Y          | Y         | Y `close`                     |                                                           |
| jumpToHome       | Y                 | Y            | Y                 | Y          | Y         | Y `backHome`                  |                                                           |
| toGrade          | Y                 | Y            | Y                 | Y          | Y         | Y `review`                    |                                                           |
| changeAccount    | Y                 | Y            | Y                 | Y          | Y         | Y `navBankList`               |                                                           |
| setTitle         | Y                 | -            | -                 | Y          | -         | -                             |                                                           |
| retryOrderDialog | -                 | Y            | -                 | -          | -         | -                             |                                                           |
| getPublicParams  | Y callback        | Y Promise    | Y Promise         | Y callback | Y Promise | Y Promise                     | 入参 ios-two 为 `{imposters: url}`，其余为裸 `url` 字符串 |

android-one / android-two 目录只含 `apiClient` 和 bridge 类，业务动作未纳入。

## 四、公参与 Token 链路

三种获取方式，均在 axios request 拦截器中每次请求实时获取，不落地存储：

| 客户端      | 获取方式                                    | 请求体加密                      | 响应解密                        | 位置                          |
|-------------|---------------------------------------------|---------------------------------|---------------------------------|-------------------------------|
| android-one | scheme-intercept 回调 Promise               | flutter-direct `PesoEasyEncode` | flutter-direct `PesoEasyDecode` | `apiClient.ts:46, 66, 109`    |
| android-two | `PG_Finance.getSession(url)` + `decodeData` | `PG_Finance.encodeData`         | `PG_Finance.decodeData`         | `apiClient.ts:43-44, 63, 106` |
| iOS 各端    | `nativeUtils.getPublicParams(url)`          | 目录内未提供 apiClient          | -                               | -                             |

拦截器公共逻辑：get/post 统一改为 post，加密后放入混淆键（`dictate/uncertainty/monkey`、`supersensible/combines/heterogeneous`），图片上传接口跳过加密（`apiClient.ts:46-50`）。

## 五、不一致点（SDK 必须抹平）

1. **handleMessage 入参类型**：ios-one/four 接收 JSON 字符串并 `JSON.parse`（`ios-one/WebViewBridge.ts:63`）；ios-two 和 flutter-callback 直接接收对象（`ios-two/WebViewBridge.ts:67`）。
2. **参数顺序**：`nativeInteraction.uploadRiskLoan(productId, orderNo)` 与 `nativeUtils.uploadRiskLoan(orderNo, productId)` 相反，所有端一致存在。
3. **参数键混淆**：同一能力在每个 App 使用不同混淆键（`dredge/brisknesses`、`monacidic/swager`、`bulking/superweapon`、`psychosexuality/hushing`），且 `getQueryParams` 兜底 productId 的键也各不相同。
4. **flutter-direct 的 Promise 包装**：ios-three 出错会 `reject`（`FlutterView.js:8`）；ios-five、android-one/three 吞掉错误返回 `undefined`（`FlutterView.ts:13-15`），调用方无法区分"不支持"与"失败"。
5. **webkit 存在性检查**：ios-one/four 直接调用，浏览器环境会抛异常（`ios-one/WebViewBridge.ts:58`）；ios-two 有检查但静默丢弃，callback 永不触发（`ios-two/WebViewBridge.ts:61`）。
6. **openUrl 语义**：ios-two 只接 `appPkg`，与 `openGooglePlay` 边界模糊。

## 六、高风险点

| 风险                       | 说明                                                                                                           | 证据                                                                     |
|----------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| 无超时                     | 所有 callback 协议均无超时，Native 不回调则 callback 永久驻留                                                  | 所有 `WebViewBridge.ts` 的 `responseCallbacks` 只在 handleMessage 时删除 |
| 公参获取挂起会阻塞整个请求 | `getPublicParamsUtil` 在 request 拦截器中 `await`，Native 不回调则请求永不发出，axios 60s timeout 不覆盖此阶段 | `android-one/apiClient.ts:46, 87-94`                                     |
| scheme-intercept 并发丢失  | `window.location.href` 连续赋值只有最后一次生效，并发请求会丢公参回调                                          | `android-one/WebViewBridge.ts:36`                                        |
| 公参经 URL scheme 传输     | token 等敏感字段出现在 URL 中，可能进入 Native 日志                                                            | 同上                                                                     |
| Ready 事件监听累积         | flutter-callback 在未就绪时每次调用都 `addEventListener`；若事件在监听前已触发则永久挂起                       | `ios-one/WebViewBridge_two.ts:65-73`                                     |
| 全局对象覆盖               | `window[bridgeName] = this` 无冲突检查，多实例或 HMR 会覆盖                                                    | 所有 `WebViewBridge.ts` 构造函数                                         |
| callbackId 无命名空间      | `cb_${n}` 每次刷新从 0 开始，多实例共存时可能碰撞                                                              | 同上                                                                     |
| 每请求都走 Bridge 取公参   | N 个接口 = N 次 Bridge 往返，弱网下首屏放大                                                                    | `apiClient.ts` request 拦截器                                            |
| 大量重复代码               | `nativeUtils.ts` 8 份，除混淆键外几乎相同                                                                      | 各目录 `nativeUtils.ts`                                                  |

## 七、对 SDK 的直接要求

由上述梳理推导，`bridge-sdk` 至少需要：

1. **统一能力名**：`getPublicParams`、`openUrl`、`closeSyn` 等作为规范方法名，通过 per-App 配置映射到混淆 action 和参数键，业务代码不再接触混淆键。
2. **协议适配器**：`webkit-callback`、`flutter-callback`、`flutter-direct`、`scheme-intercept`、`exposed-sync` 五种各一个 adapter，对外统一返回 Promise。
3. **超时 + 清理**：每次调用带 timeout，超时 reject 并删除 callback；晚到的回调丢弃并记日志。
4. **统一错误类型**：`TIMEOUT`、`UNSUPPORTED`、`NOT_READY`、`NATIVE_ERROR`、`INVALID_RESPONSE`，让上层能区分。
5. **就绪管理**：Flutter ready 事件只监听一次，未就绪的调用进入队列，超时也要 reject。
6. **公参缓存策略**：允许短 TTL 内存缓存（不落地），减少每请求 Bridge 往返；缓存失效时合并并发请求为一次。
7. **环境探测 + Web Mock**：浏览器环境返回 Mock 数据而不是抛错或挂起。
8. **调用日志脱敏**：token 等字段在日志中打码。

## 八、推荐方案（基于现有配置推导，不依赖历史版本记录）

### 8.1 版本兼容：用能力探测替代版本号

目录内没有任何版本判断代码，且各 App 的 action 名和参数键都是独立混淆的，靠"记住每个 App 的最低版本"不可维护。推荐三层探测，按顺序执行：

```text
1. 运行时探测   window.webkit?.messageHandlers?.[name]
                window.flutter_inappwebview?.callHandler
                window.PesoFunny / window.PG_Finance
                -> 决定走哪个 adapter

2. 能力探测     调用 getPublicParams 时顺带读取返回值中的 appVersion 字段
                （公参本身就包含版本信息，无需新增 Bridge 方法）
                -> 缓存到内存，供后续判断

3. 方法级开关   SDK 配置表中为每个 method 声明 minAppVersion（可选）
                + 远程配置开关 disabledMethods: string[]
                -> 版本低或被远程禁用时走 fallback
```

第 3 层的远程开关就是"回滚"的实现方式：Bridge 出问题时不需要发 App，也不需要发 H5，改配置即可关闭某个方法并走降级。

### 8.2 回滚策略：每个方法声明 fallback

| 能力                                       | 推荐 fallback                                    |
|--------------------------------------------|--------------------------------------------------|
| getPublicParams                            | 无 fallback，直接 reject，请求层展示"请升级 App" |
| openUrl / openGooglePlay                   | `window.location.href = url`                     |
| closeSyn / jumpToHome                      | `history.back()`，兜底展示"请手动返回"           |
| toGrade / retryOrderDialog / changeAccount | Toast 提示"当前版本不支持"，不阻断主流程         |
| uploadRiskLoan                             | 静默失败并上报监控，不影响用户                   |
| setTitle                                   | `document.title = title`                         |

原则：只有 getPublicParams 是阻断性的，其余都可以降级。

### 8.3 iOS apiClient 公参注入：与 Android 对齐

iOS 目录里只有 `nativeUtils.getPublicParams(url)`，没有 apiClient。推荐 iOS 走与 android-one 相同的拦截器结构，只替换公参获取来源：

```ts
apiClient.interceptors.request.use(async (config) => {
  const url = config.url?.split("?")[0] ?? "";
  const publicParams = await bridge.getPublicParams(url, { timeout: 3000 });
  config.params = { ...config.params, ...publicParams };
  return config;
});
```

三点与 Android 的差异必须处理：

1. **超时**：ios-one/four 的 callback 版没有 Promise 包装，ios-two 有但无超时。SDK 层统一加 3s 超时，超时 reject 让请求快速失败，而不是像 `android-one/apiClient.ts:46` 那样无限挂起。
2. **入参格式**：ios-two 传 `{imposters: url}`，其余传裸 `url`。放进 per-App 配置的参数映射，拦截器不感知。
3. **加解密**：iOS 目录内没有 encode/decode 调用。如果 iOS 接口也需要加密，需要确认是 Native 侧在 WKWebView 层拦截处理，还是 H5 需要像 Android 一样调 Bridge 加解密。这是唯一需要回到原项目确认的点。

### 8.4 公参缓存：短 TTL 内存缓存 + 并发合并

现状是每个接口都走一次 Bridge。推荐：

```text
TTL：            5-10s 内存缓存，不写 storage
并发合并：        同一 url 的 getPublicParams 在飞行中时，后续调用复用同一个 Promise
失效：            页面 visibilitychange 回到前台时清缓存（App 可能切换了账号）
按 url 维度：     公参可能与 url 相关（现有代码都传 url），缓存 key 用 url
```

如果确认公参与 url 无关，key 退化为常量，合并效果更好。

### 8.5 android-one / android-two 业务动作

目录内缺失。推荐在 SDK 配置表中先把这两端的业务动作标为 `UNSUPPORTED`，走 8.2 的 fallback。等接入真实项目时再补 action 映射，不阻塞 SDK 开发。

### 8.6 线上问题记录：从现在开始建

历史无法追溯就不追溯。SDK 上线后每次 Bridge 调用记录以下字段上报到 GlitchTip，之后的问题排查靠数据而不是记忆：

```text
method, adapter, appVersion, h5Version, duration, result(ok/timeout/error), errorCode
```

## 九、明确不做的事

- 不为 8 个 App 逐个维护版本兼容表
- 不在 H5 侧持久化 token 或公参
- 不让业务代码直接引用混淆 action 名
- 不修改现有 `bridge-methods/` 源码，它们只作为 adapter 的实现参考
