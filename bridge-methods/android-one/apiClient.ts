import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "query-string";

import FlutterBridge from "@/utils/FlutterView";
import WebViewBridge from "@/utils/WebViewBridge";

import { AppConfig } from "@/AppConfig";
import { ApiResponse } from "@/modules/ApiResponse";

import { ApiConstants } from "./apiConstants";

const bridge = new WebViewBridge("getParams");

interface PublicParamsType {
  ["possibilities"]?: string;
  ["though"]: string | number;
  ["contradict"]?: string;
  ["attested"]?: string;
  ["establishes"]?: string;
  ["unavoidable"]?: string;
  ["warns"]?: string;
  ["negation"]?: string;
  ["exemplification"]?: string;
  ["additional"]?: string | number;
  ["aiotheta"]?: string;
}

const apiClient: AxiosInstance = axios.create({
  timeout: 60000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  } as AxiosRequestConfig["headers"],
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const newParams = { ...config.params };
    const forwordPreifx = AppConfig.forwardPrefix;
    const url = config.url?.split("?")[0] || "";
    const publicParams = await getPublicParamsUtil(url);

    config.params = { ...newParams, ...publicParams };
    const regImgUrl = new RegExp(ApiConstants.SUBMIT_CUSTOMER_SERVICE_IMAGE);
    const reqMethod = config.method;
    if (regImgUrl.test((config.url || "").split("?")[0])) {
      config.url = forwordPreifx + config.url;
      return config;
    } else {
      let paramDate;
      switch (reqMethod) {
        case "get":
          paramDate = newParams; // 获取除去公参外的所有参数
          break;
        case "post":
          paramDate = qs.parse(config.data);
          break;
        default:
          paramDate = qs.parse(config.data);
      }
      const aesDecodeData = await FlutterBridge("PesoEasyEncode", paramDate || {});
      switch (reqMethod) {
        case "get":
          config.data = qs.stringify({ "supersensible": aesDecodeData });
          break;
        case "post":
          config.data = qs.stringify({ "combines": aesDecodeData });
          break;
        default:
          config.data = qs.stringify({ "heterogeneous": aesDecodeData });
      }
      config.method = "post";
      config.url = forwordPreifx + config.url;
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

const getPublicParamsUtil = (url: string): Promise<PublicParamsType> => {
  return new Promise((resolve) => {
    bridge.send(url, (res) => {
      console.log(res, "resolveParams");
      resolve(res);
    });
  });
};

function isJSONString(str: string) {
  try {
    const parsed = JSON.parse(str);
    // 仅当解析结果为对象或数组时视为有效 JSON 格式
    return (typeof parsed === "object" && parsed !== null) || Array.isArray(parsed);
  } catch (e) {
    console.log(e);
    return false;
  }
}

apiClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const deData = await FlutterBridge("PesoEasyDecode", response.data["imitated"] || "");
    if (typeof deData === "string" && isJSONString(deData)) {
      response.data["imitated"] = JSON.parse(deData);
    } else {
      response.data["imitated"] = deData;
    }

    const res = new ApiResponse(response.data);
    if (res.isSuccess) {
      response.data = res;
      return response.data;
    } else {
      return Promise.reject(new Error(res.message)) as never;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export { apiClient };
