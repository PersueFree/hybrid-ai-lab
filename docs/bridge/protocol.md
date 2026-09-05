# Bridge 协议设计

## 1. 两层命名

H5 使用稳定的语义方法名，例如 `uploadRiskLoan`。Native 不识别这些语义名称，而是识别客户端约定的 wire action，例如 `nexa_way_ejR96ofeG42gqC9`。

```text
H5:      uploadRiskLoan({ productId, orderNo })
SDK:     查找当前 appId 的 action 和参数键映射
Native:  根据 nexa_way_ejR96ofeG42gqC9 选择交互函数
```

`nexa_way_xxx`、`pera_rise_xxx`、`sure_vida_xxx`、`vera_point_xxx`、`yes_peso_xxx` 只能出现在 per-App 配置中，不进入业务代码。

## 2. 统一 H5 API

业务模块使用语义函数，不直接拼接 Native action：

```ts
interface BridgeApi {
  uploadRiskLoan(productId: string, orderNo?: string | number): Promise<void>;
  openUrl(url: string, single?: number): Promise<void>;
  openGooglePlay(urlOrPackage: string): Promise<void>;
  closeSyn(): Promise<void>;
  jumpToHome(): Promise<void>;
  toGrade(): Promise<void>;
  changeAccount(productId?: string, orderNo?: string | number): Promise<void>;
  setTitle(title: string): Promise<void>;
  retryOrderDialog(orderNo: string | number): Promise<void>;
  getPublicParams(url: string): Promise<Record<string, unknown>>;
}
```

调用示例：

```ts
await bridge.uploadRiskLoan("product-001", "order-001");
await bridge.openUrl("https://example.com", 1);
const publicParams = await bridge.getPublicParams("/api/order/detail");
```

语义函数内部再调用统一核心接口：

```ts
export function createBridgeApi(client: BridgeClient): BridgeApi {
  return {
    uploadRiskLoan: (productId, orderNo) =>
      client.call("uploadRiskLoan", { productId, orderNo }),
    openUrl: (url, single) => client.call("openUrl", { url, single }),
    openGooglePlay: (urlOrPackage) =>
      client.call("openGooglePlay", { urlOrPackage }),
    closeSyn: () => client.call("closeSyn"),
    jumpToHome: () => client.call("jumpToHome"),
    toGrade: () => client.call("toGrade"),
    changeAccount: (productId, orderNo) =>
      client.call("changeAccount", { productId, orderNo }),
    setTitle: (title) => client.call("setTitle", { title }),
    retryOrderDialog: (orderNo) =>
      client.call("retryOrderDialog", { orderNo }),
    getPublicParams: (url) => client.call("getPublicParams", { url }),
  };
}
```

SDK 内部先完成 `method -> action + payload` 转换，再交给对应 adapter 发送。

例如 iOS One 的 `uploadRiskLoan`：

```text
method:  uploadRiskLoan
action:  nexa_way_ejR96ofeG42gqC9
payload: { dredge: productId, brisknesses: orderNo }
```

`setTitle` 和 iOS One 的 `getPublicParams` 使用直接值 payload；其他对象参数使用 `paramKeys` 完成字段转换。

## 3. 方法与返回

| H5 方法 | 参数 | 返回 | 敏感信息 | 默认超时 | fallback |
|---|---|---|---|---:|---|
| `uploadRiskLoan` | `productId`, `orderNo?` | `void` | 是 | 3s | `silent` |
| `openUrl` | `url`, `single?` | `void` | 否 | 3s | `browser` |
| `openGooglePlay` | `urlOrPackage` | `void` | 否 | 3s | `browser` |
| `closeSyn` | 无 | `void` | 否 | 3s | `history` |
| `jumpToHome` | 无 | `void` | 否 | 3s | `history` |
| `toGrade` | 无 | `void` | 否 | 3s | `silent` |
| `changeAccount` | `productId?`, `orderNo?` | `void` | 否 | 3s | `silent` |
| `setTitle` | `title` | `void` | 否 | 3s | `document.title` |
| `retryOrderDialog` | `orderNo` | `void` | 否 | 3s | `silent` |
| `getPublicParams` | `url` | 公参对象 | 是 | 3s | `reject` |

## 4. Per-App action 映射

### iOS One / iOS Four

| H5 方法 | Native action | 参数映射 |
|---|---|---|
| `uploadRiskLoan` | `nexa_way_ejR96ofeG42gqC9` | `productId -> dredge`, `orderNo -> brisknesses` |
| `openUrl` | `nexa_way_bLQqnOMg9PmzrYU` | `url -> lengthening`, `single -> ZqUPZ8K` |
| `closeSyn` | `nexa_way_8gGtoT6O0mUSf7A` | 无 |
| `jumpToHome` | `nexa_way_ZNUXejILfzizwDD` | 无 |
| `toGrade` | `nexa_way_1hdJsuLFhW550G2` | 无 |
| `changeAccount` | `nexa_way_U8I08MlEvyYJLXw` | `productId -> dredge`, `orderNo -> brisknesses` |
| `setTitle` | `nexa_way_MZhiztQYDEVfbJE` | title 直接传递 |
| `getPublicParams` | `nexa_way_IZQjtVYVaj1VMHG` | url 直接传递 |

协议为 `webkit-callback`：发送 `{ action, data, callbackId }` JSON 字符串，Native 调用 `window[bridgeName].handleMessage(...)`。

### iOS Two

使用 `pera_rise_*` action，参数键为 `monacidic`（productId）和 `swager`（orderNo）。`getPublicParams` 的 payload 为 `{ imposters: url }`。协议为 `webkit-callback`。

### iOS Three / iOS Five

分别使用 `sure_vida_*` / `vera_point_*` action，通过 `flutter_inappwebview.callHandler(action, payload)` 直接取得 Promise 返回值。没有 callbackId。两端的业务参数键不同，必须由配置映射。

### Android Three

业务方法使用 `window.PesoFunny.mark/navHost/close/backHome/review/navBankList`，公参使用 `yes_peso_UqCapMcZIIfqoRe` 的 Flutter direct action。这里 Native 方法名本身就是 wire 入口，不能误当作 H5 语义方法名。

### Android One / Android Two

Android One 的公参使用 `getPublicParams://pera_snap?...` URL Scheme，编码解码使用 `PesoEasyEncode/Decode`。Android Two 当前请求链路使用 `window.PG_Finance.getSession/encodeData/decodeData`，旧的 Scheme bridge 已注释。两端的业务 action 在样本目录中不完整，配置中应省略未支持方法。

## 5. Adapter 接口

```ts
interface BridgeAdapter {
  detect(): boolean;
  call(
    action: string,
    payload?: unknown,
    options?: { timeout: number },
  ): Promise<unknown>;
}
```

Adapter 只处理传输协议：如何发送 action、如何生成或接收 callback、如何等待 direct 返回。它不判断 `uploadRiskLoan` 等业务语义。

WebKit callback adapter 的发送格式：

```ts
{
  action: "nexa_way_ejR96ofeG42gqC9",
  data: { dredge: productId, brisknesses: orderNo },
  callbackId: "cb_0",
}
```

Native 可以回传 JSON 字符串或对象。adapter 在成功、错误和超时三种路径都会清理 pending callback；超时后到达的 callback 会被忽略。

## 6. 错误与生命周期

| 错误码 | 含义 | 处理 |
|---|---|---|
| `TIMEOUT` | Native 在期限内没有返回 | 清理 callback，按方法 fallback |
| `UNSUPPORTED` | 当前 App 没有该 action 或 adapter | 直接 fallback |
| `NOT_READY` | Flutter Bridge 尚未就绪 | 等待 ready 或超时失败 |
| `NATIVE_ERROR` | Native 返回明确错误 | 保留 cause，不伪装成成功 |
| `INVALID_RESPONSE` | 返回值不符合方法约定 | reject 并记录脱敏日志 |

超时后到达的 callback 必须丢弃。每个 callback 必须在成功、失败或超时后清理。Flutter ready 事件只注册一次，普通浏览器环境不得永久挂起。

## 7. 请求层约束

- `getPublicParams` 是阻断性方法，失败时不能假装拿到了公参。
- 公参只允许短 TTL 内存缓存，不写入持久化存储。
- 同一 URL 的并发公参请求应合并为一个 Promise。
- 请求和 Bridge 日志不得输出完整 token、公参或加密 payload。
