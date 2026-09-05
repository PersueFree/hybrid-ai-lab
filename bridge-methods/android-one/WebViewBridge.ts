import qs from "query-string";

type MessageData = any; // Replace with more specific type if possible
type ResponseCallback = (data: MessageData) => void;

export default class WebViewBridge {
  private bridgeName: string;
  private uniqueId: number;
  private responseCallbacks: Record<string, ResponseCallback>;

  constructor(bridgeName: string) {
    this.bridgeName = bridgeName;
    this.uniqueId = 0;
    this.responseCallbacks = {};

    // Add type assertion for window property
    (window as any)[bridgeName] = this;
  }

  send(data: MessageData, callback?: ResponseCallback): void {
    const message: {
      data: MessageData;
      callbackId: string | null;
    } = {
      data,
      callbackId: null,
    };

    if (callback) {
      const callbackId = `cb_${this.uniqueId++}`;
      this.responseCallbacks[callbackId] = callback;
      message.callbackId = callbackId;
    }

    try {
      window.location.href = `getPublicParams://pera_snap?${qs.stringify(message)}`;
    } catch (e) {
      console.error("WebViewBridge send error:", e);
    }
  }

  handleMessage(message: { data: MessageData; callbackId?: string }): void {
    const { data, callbackId } = message;

    if (callbackId && this.responseCallbacks[callbackId]) {
      const handler = this.responseCallbacks[callbackId];
      try {
        handler(data);
      } catch (e) {
        console.error("WebViewBridge callback error:", e);
      }
      delete this.responseCallbacks[callbackId];
    }
  }
}
