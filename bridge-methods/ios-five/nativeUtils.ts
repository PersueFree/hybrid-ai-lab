import { getQueryParams } from "./getQueryParams";
import nativeInteraction from "./nativeInteraction";

interface PublicParamsType {
  // ["gizmos"]?: string;
  ["piperine"]: string | number;
  ["hamlets"]?: string;
  ["rewinds"]?: string;
  ["underreport"]?: string;
  ["huaraches"]?: string;
  ["narrowness"]?: string;
  ["overobvious"]?: string;
  ["homotransplants"]?: string;
  ["legitimated"]?: string | number;
  ["litres"]?: string;
}

export function uploadRiskLoan(orderNo?: string | number, productId?: string) {
  try {
    const params = getQueryParams();
    const _productId = productId || params["psychosexuality"];
    nativeInteraction.uploadRiskLoan(_productId, orderNo);
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

export function openUrl(url: string, single?: number) {
  try {
    nativeInteraction.openUrl(url, single);
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

export function changeAccount(orderNo?: number | string, productId?: string) {
  try {
    const params = getQueryParams();
    const _productId = productId || params["psychosexuality"];
    nativeInteraction.changeAccount(_productId, String(orderNo || ""));
  } catch (e) {
    console.error(e);
  }
}

export const getPublicParams = async (url: string) => {
  try {
    const data = await nativeInteraction.getPublicParams(url);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export default {
  uploadRiskLoan,
  openGooglePlay,
  openUrl,
  closeSyn,
  jumpToHome,
  toGrade,
  changeAccount,
  getPublicParams,
};

export type { PublicParamsType };
