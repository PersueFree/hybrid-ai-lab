type CallbackFunction = (data?: string) => void;
type ResponseCallbacks = Record<string, CallbackFunction | undefined>;

interface orderTypes {
  ["dredge"]?: string;
  ["brisknesses"]?: string | number;
  ["lengthening"]?: string;
  ["ZqUPZ8K"]?: number;
}

interface WebViewMessage {
  action: string;
  data?: string | orderTypes;
  callbackId: string | null;
}

declare global {
  interface Window {
    [key: string]: unknown;
    webkit: {
      messageHandlers: {
        [key: string]: {
          postMessage(data: string): void;
        };
      };
    };
  }
}

export default class WebViewBridge {
  private bridgeName: string;
  private uniqueId: number;
  private responseCallbacks: ResponseCallbacks;

  constructor(bridgeName: string) {
    this.bridgeName = bridgeName;
    this.uniqueId = 0;
    this.responseCallbacks = {};

    // 安全地挂载到 window 对象
    if (typeof window !== "undefined") {
      window[bridgeName] = this;
    }
  }

  send(action: string, data?: orderTypes | string, callback?: CallbackFunction): void {
    const message: WebViewMessage = {
      action,
      data,
      callbackId: null,
    };

    const callbackId = `cb_${this.uniqueId++}`;
    this.responseCallbacks[callbackId] = callback;
    message.callbackId = callbackId;
    console.log("WebViewBridge send", message);

    window?.webkit?.messageHandlers[this.bridgeName].postMessage(JSON.stringify(message));
  }

  handleMessage(message?: string): void {
    console.log("WebViewBridge handleMessage", message);
    const _message = JSON.parse(message || "{}");
    if (!_message?.callbackId) return;

    const handler = this.responseCallbacks[_message.callbackId];
    if (typeof handler === "function") {
      try {
        handler(_message.data);
      } catch (error) {
        console.error("WebViewBridge callback error:", error);
      }
      delete this.responseCallbacks[_message.callbackId];
    }
  }
}
