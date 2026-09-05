import type { BridgeApi, BridgeClient } from "./types";

/** Builds the stable H5 semantic API on top of the protocol-aware client. */
export function createBridgeApi(client: BridgeClient): BridgeApi {
  return {
    uploadRiskLoan(productId, orderNo) {
      return client.call("uploadRiskLoan", { productId, orderNo });
    },

    openUrl(url, single) {
      return client.call("openUrl", { url, single });
    },

    openGooglePlay(urlOrPackage) {
      return client.call("openGooglePlay", { urlOrPackage });
    },

    closeSyn() {
      return client.call("closeSyn");
    },

    jumpToHome() {
      return client.call("jumpToHome");
    },

    toGrade() {
      return client.call("toGrade");
    },

    changeAccount(productId, orderNo) {
      return client.call("changeAccount", { productId, orderNo });
    },

    setTitle(title) {
      return client.call("setTitle", { title });
    },

    retryOrderDialog(orderNo) {
      return client.call("retryOrderDialog", { orderNo });
    },

    getPublicParams(url) {
      return client.call("getPublicParams", { url });
    },
  };
}
