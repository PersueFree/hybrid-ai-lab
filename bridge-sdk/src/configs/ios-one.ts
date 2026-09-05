import type { AppBridgeConfig } from "../types";

export const iosOneConfig: AppBridgeConfig = {
  appId: "ios-one",
  adapter: "webkit-callback",
  actions: {
    uploadRiskLoan: {
      action: "nexa_way_ejR96ofeG42gqC9",
      paramKeys: { productId: "dredge", orderNo: "brisknesses" },
    },
    openUrl: {
      action: "nexa_way_bLQqnOMg9PmzrYU",
      paramKeys: { url: "lengthening", single: "ZqUPZ8K" },
    },
    closeSyn: { action: "nexa_way_8gGtoT6O0mUSf7A" },
    jumpToHome: { action: "nexa_way_ZNUXejILfzizwDD" },
    toGrade: { action: "nexa_way_1hdJsuLFhW550G2" },
    changeAccount: {
      action: "nexa_way_U8I08MlEvyYJLXw",
      paramKeys: { productId: "dredge", orderNo: "brisknesses" },
    },
    setTitle: {
      action: "nexa_way_MZhiztQYDEVfbJE",
      payload: "value",
    },
    getPublicParams: {
      action: "nexa_way_IZQjtVYVaj1VMHG",
      payload: "value",
    },
  },
};
