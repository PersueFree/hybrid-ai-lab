import {
  BridgeError,
  type AppBridgeConfig,
  type BridgeAdapter,
  type BridgeClient,
  type BridgeMethod,
  type CallOptions,
  type MethodParams,
  type MethodResult,
} from "./types";

const DEFAULT_TIMEOUT = 3000;

function mapPayload(
  params: unknown,
  config: { paramKeys?: Record<string, string>; payload?: "object" | "value" },
): unknown {
  if (config.payload === "value") {
    if (params && typeof params === "object" && "url" in params) {
      return (params as { url: string }).url;
    }
    return params;
  }

  if (!config.paramKeys || !params || typeof params !== "object") {
    return params;
  }

  return Object.entries(params as Record<string, unknown>).reduce(
    (payload, [key, value]) => {
      const nativeKey = config.paramKeys?.[key] ?? key;
      payload[nativeKey] = value;
      return payload;
    },
    {} as Record<string, unknown>,
  );
}

export function createBridgeClient(
  appConfig: AppBridgeConfig,
  adapter: BridgeAdapter,
): BridgeClient {
  return {
    async call<M extends BridgeMethod>(
      method: M,
      ...args: MethodParams<M> extends undefined
        ? [params?: undefined, options?: CallOptions]
        : [params: MethodParams<M>, options?: CallOptions]
    ): Promise<MethodResult<M>> {
      const [params, options] = args as [unknown?, CallOptions?];
      const methodConfig = appConfig.actions[method];

      if (!methodConfig?.action) {
        throw new BridgeError(
          "UNSUPPORTED",
          `${method} is not supported by ${appConfig.appId}`,
          { method },
        );
      }

      if (!adapter.detect()) {
        throw new BridgeError(
          "UNSUPPORTED",
          `Bridge adapter ${appConfig.adapter} is unavailable`,
          { method },
        );
      }

      try {
        const payload = mapPayload(params, methodConfig);
        return (await adapter.call(methodConfig.action, payload, {
          timeout: options?.timeout ?? DEFAULT_TIMEOUT,
        })) as MethodResult<M>;
      } catch (error) {
        if (error instanceof BridgeError) throw error;
        throw new BridgeError("NATIVE_ERROR", `${method} failed`, {
          method,
          cause: error,
        });
      }
    },
  };
}
