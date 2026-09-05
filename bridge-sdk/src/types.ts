/** H5 对外暴露的稳定语义方法名。 */
export type BridgeMethod =
  | "uploadRiskLoan"
  | "openUrl"
  | "openGooglePlay"
  | "closeSyn"
  | "jumpToHome"
  | "toGrade"
  | "changeAccount"
  | "setTitle"
  | "retryOrderDialog"
  | "getPublicParams";

export type AdapterType =
  | "webkit-callback"
  | "flutter-callback"
  | "flutter-direct"
  | "scheme-intercept"
  | "exposed-sync";

export type BridgeErrorCode =
  | "TIMEOUT"
  | "UNSUPPORTED"
  | "NOT_READY"
  | "NATIVE_ERROR"
  | "INVALID_RESPONSE";

export interface BridgeMethods {
  uploadRiskLoan: {
    params: { productId: string; orderNo?: string | number };
    result: void;
  };
  openUrl: {
    params: { url: string; single?: number };
    result: void;
  };
  openGooglePlay: {
    params: { urlOrPackage: string };
    result: void;
  };
  closeSyn: { params: undefined; result: void };
  jumpToHome: { params: undefined; result: void };
  toGrade: { params: undefined; result: void };
  changeAccount: {
    params: { productId?: string; orderNo?: string | number };
    result: void;
  };
  setTitle: { params: { title: string }; result: void };
  retryOrderDialog: {
    params: { orderNo: string | number };
    result: void;
  };
  getPublicParams: {
    params: { url: string };
    result: Record<string, unknown>;
  };
}

export type MethodParams<M extends BridgeMethod> = BridgeMethods[M]["params"];
export type MethodResult<M extends BridgeMethod> = BridgeMethods[M]["result"];

export class BridgeError extends Error {
  readonly code: BridgeErrorCode;
  readonly method?: BridgeMethod;
  readonly cause?: unknown;

  constructor(
    code: BridgeErrorCode,
    message: string,
    options?: { method?: BridgeMethod; cause?: unknown },
  ) {
    super(message);
    this.name = "BridgeError";
    this.code = code;
    this.method = options?.method;
    this.cause = options?.cause;
  }
}

export interface CallOptions {
  timeout?: number;
  minAppVersion?: string;
  fallback?: "reject" | "browser" | "history" | "silent";
}

export interface BridgeActionConfig {
  /** Native uses this wire action to select the interaction handler. */
  action: string;
  /** Maps semantic H5 parameter names to obfuscated Native keys. */
  paramKeys?: Record<string, string>;
  /** Some Native handlers receive one value instead of an object payload. */
  payload?: "object" | "value";
}

export interface AppBridgeConfig {
  appId: string;
  adapter: AdapterType;
  /** Unsupported methods are omitted from this per-App map. */
  actions: Partial<Record<BridgeMethod, BridgeActionConfig>>;
}

export interface BridgeAdapter {
  detect(): boolean;
  call(
    action: string,
    payload?: unknown,
    options?: { timeout: number },
  ): Promise<unknown>;
}

export interface BridgeClient {
  call<M extends BridgeMethod>(
    method: M,
    ...args: MethodParams<M> extends undefined
      ? [params?: undefined, options?: CallOptions]
      : [params: MethodParams<M>, options?: CallOptions]
  ): Promise<MethodResult<M>>;
}

/** Stable semantic API consumed by H5 business modules. */
export interface BridgeApi {
  uploadRiskLoan(productId: string, orderNo?: string | number): Promise<void>;
  openUrl(url: string, single?: number): Promise<void>;
  openGooglePlay(urlOrPackage: string): Promise<void>;
  closeSyn(): Promise<void>;
  jumpToHome(): Promise<void>;
  toGrade(): Promise<void>;
  changeAccount(
    productId?: string,
    orderNo?: string | number,
  ): Promise<void>;
  setTitle(title: string): Promise<void>;
  retryOrderDialog(orderNo: string | number): Promise<void>;
  getPublicParams(url: string): Promise<Record<string, unknown>>;
}
