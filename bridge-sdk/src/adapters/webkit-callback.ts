import { BridgeError, type BridgeAdapter } from "../types";

interface WebkitMessage {
  action: string;
  data?: unknown;
  callbackId: string;
}

interface WebkitResponse {
  callbackId?: string;
  data?: unknown;
  error?: unknown;
}

interface WebkitWindow extends Window {
  webkit?: {
    messageHandlers?: Record<string, { postMessage(message: string): void }>;
  };
  [key: string]: unknown;
}

interface PendingCall {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
}

export interface WebkitCallbackAdapterOptions {
  bridgeName: string;
  globalObject?: WebkitWindow;
}

export function createWebkitCallbackAdapter(
  options: WebkitCallbackAdapterOptions,
): BridgeAdapter & { handleMessage(message: string | WebkitResponse): void } {
  let uniqueId = 0;
  const pending = new Map<string, PendingCall>();
  const target = options.globalObject ?? (typeof window !== "undefined" ? (window as WebkitWindow) : undefined);

  const adapter = {
    detect(): boolean {
      return Boolean(
        target?.webkit?.messageHandlers?.[options.bridgeName]?.postMessage,
      );
    },

    call(action: string, payload?: unknown, callOptions?: { timeout: number }) {
      const handler = target?.webkit?.messageHandlers?.[options.bridgeName];
      if (!handler?.postMessage) {
        return Promise.reject(
          new BridgeError("UNSUPPORTED", `Missing WebKit handler ${options.bridgeName}`),
        );
      }

      const callbackId = `cb_${uniqueId++}`;
      const message: WebkitMessage = { action, data: payload, callbackId };
      const timeout = callOptions?.timeout ?? 3000;

      return new Promise<unknown>((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(callbackId);
          reject(new BridgeError("TIMEOUT", `Native action ${action} timed out`));
        }, timeout);

        pending.set(callbackId, { resolve, reject, timer });

        try {
          handler.postMessage(JSON.stringify(message));
        } catch (error) {
          clearTimeout(timer);
          pending.delete(callbackId);
          reject(new BridgeError("NATIVE_ERROR", `Native action ${action} failed`, { cause: error }));
        }
      });
    },

    handleMessage(message: string | WebkitResponse): void {
      let response: WebkitResponse;
      try {
        response = typeof message === "string" ? JSON.parse(message) : message;
      } catch (error) {
        console.error("Invalid WebKit bridge response", error);
        return;
      }

      if (!response.callbackId) return;
      const call = pending.get(response.callbackId);
      if (!call) return;

      pending.delete(response.callbackId);
      clearTimeout(call.timer);
      if (response.error !== undefined) {
        call.reject(
          new BridgeError("NATIVE_ERROR", "Native returned an error", {
            cause: response.error,
          }),
        );
        return;
      }
      call.resolve(response.data);
    },
  };

  if (target) {
    target[options.bridgeName] = adapter;
  }

  return adapter;
}
