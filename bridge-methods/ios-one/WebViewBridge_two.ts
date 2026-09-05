type CallbackFunction = (data?: string) => void;
type ResponseCallbacks = Record<string, CallbackFunction | undefined>;

interface orderTypes {
  ["sinking"]?: string;
  ["nostrils"]?: string | number;
  ["dardanus"]?: string;
  url?: string;
}

interface WebViewMessage {
  action: string;
  data?: string | orderTypes;
  callbackId: string | null;
}

declare global {
  interface Window {
    [key: string]: unknown;
    flutter_inappwebview?: {
      callHandler: (handlerName: string, message: WebViewMessage | string) => void;
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

    window[bridgeName] = this;
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

    const invokeHandler = () => {
      try {
        console.log("WebViewBridge invokeHandler send", message);
        window.flutter_inappwebview?.callHandler(this.bridgeName, message);
      } catch (error) {
        console.error(error);
        delete this.responseCallbacks[callbackId];
      }
    };

    if (window.flutter_inappwebview) {
      invokeHandler();
    } else {
      const readyHandler = () => {
        window.removeEventListener("flutterInAppWebViewPlatformReady", readyHandler);
        invokeHandler();
      };
      window.addEventListener("flutterInAppWebViewPlatformReady", readyHandler);
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
}
