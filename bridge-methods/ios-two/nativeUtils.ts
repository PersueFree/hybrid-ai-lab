import { getQueryParams } from "./getQueryParams";
import nativeInteraction from "./nativeInteraction";

interface PublicParamsType {
  // ["timbermen"]?: string;
  ["hame"]: string | number;
  ["kayaker"]?: string;
  ["plutonian"]?: string;
  ["facsimiled"]?: string;
  ["barhop"]?: string;
  ["revamp"]?: string;
  ["swiller"]?: string;
  ["holloware"]?: string;
  ["mammary"]?: string | number;
  ["catwalks"]?: string;
}

export function uploadRiskLoan(orderNo?: string | number, productId?: string) {
  try {
    const params = getQueryParams();
    const _productId = productId || params["monacidic"];
    nativeInteraction.uploadRiskLoan(_productId, orderNo);
  } catch (e) {
    console.error(e);
  }
}
export function openUrl(url: string) {
  try {
    nativeInteraction.openUrl(url);
  } catch (e) {
    console.error(e);
  }
}

export function openGooglePlay(url: string) {
  try {
    nativeInteraction.openGooglePlay(url);
  } catch (e) {
    console.error(e);
  }
}
export function closeSyn() {
  try {
    nativeInteraction.closeSyn();
  } catch (e) {
    console.error(e);
  }
}
export function jumpToHome() {
  try {
    nativeInteraction.jumpToHome();
  } catch (e) {
    console.error(e);
  }
}
export function toGrade() {
  try {
    nativeInteraction.toGrade();
  } catch (e) {
    console.error(e);
  }
}

export function retryOrderDialog(orderNo: string | number) {
  try {
    nativeInteraction.retryOrderDialog(orderNo);
  } catch (e) {
    console.error(e);
  }
}
export function changeAccount(orderNo?: number | string, productId?: string) {
  try {
    const params = getQueryParams();
    const _productId = productId || params["monacidic"];
    nativeInteraction.changeAccount(_productId, orderNo);
  } catch (e) {
    console.error(e);
  }
}

export const getPublicParams = (url: string): Promise<PublicParamsType> => {
  return new Promise((resolve, reject) => {
    try {
      nativeInteraction.getPublicParams(url, (data) => resolve(data));
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

export default {
  uploadRiskLoan,
  openUrl,
  openGooglePlay,
  closeSyn,
  jumpToHome,
  toGrade,
  retryOrderDialog,
  changeAccount,
  getPublicParams,
};

export type { PublicParamsType };
