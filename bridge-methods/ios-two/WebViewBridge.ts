type CallbackFunction = (data?: string) => void;
type ResponseCallbacks = Record<string, CallbackFunction | undefined>;

interface orderTypes {
  ["monacidic"]?: string;
  ["swager"]?: string | number;
  ["imposters"]?: string;
}

interface WebViewMessage {
  action: string;
  data?: string | orderTypes;
  callbackId: string | null;
}

declare global {
  interface Window {
    [key: string]: unknown;
    webkit?: {
      messageHandlers: {
        [key: string]: {
          postMessage: (message: string) => void;
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
    if (typeof window === "undefined") {
      console.error("WebViewBridge: Window object not available");
      return;
    }

    const message: WebViewMessage = {
      action,
      data,
      callbackId: null,
    };

    const callbackId = `cb_${this.uniqueId++}`;
    this.responseCallbacks[callbackId] = callback;
    message.callbackId = callbackId;

    if (window.webkit?.messageHandlers?.[this.bridgeName]?.postMessage) {
      console.log("WebViewBridge send", message);
      window.webkit.messageHandlers[this.bridgeName].postMessage(JSON.stringify(message));
    }
  }

  handleMessage(message: { data?: string; callbackId?: string }): void {
    console.log("WebViewBridge handleMessage", message);
    if (!message?.callbackId) return;

    const handler = this.responseCallbacks[message.callbackId];
    if (typeof handler === "function") {
      try {
        handler(message.data);
      } catch (error) {
        console.error("WebViewBridge callback error:", error);
      }
      delete this.responseCallbacks[message.callbackId];
    }
  }

  // 清理方法
  destroy(): void {
    if (typeof window !== "undefined" && window[this.bridgeName] === this) {
      delete window[this.bridgeName];
    }
    this.responseCallbacks = {};
  }
}
