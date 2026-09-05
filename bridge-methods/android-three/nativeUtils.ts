import { getQueryParams } from "./getQueryParams";
import nativeInteraction from "./nativeInteraction";

interface PublicParamsType {
  ["gneisses"]?: string;
  ["fluorosis"]: string | number;
  ["mucosae"]?: string;
  ["whoremongers"]?: string;
  ["siltstone"]?: string;
  ["growing"]?: string;
  ["freemen"]?: string;
  ["fountainhead"]?: string;
  ["lachrymators"]?: string;
  ["paragraphing"]?: string | number;
  ["voyeurism"]?: string;
}

export function uploadRiskLoan(orderNo?: string | number, productId?: string) {
  try {
    const params = getQueryParams();
    const _productId = productId || params["frequent"];
    nativeInteraction.uploadRiskLoan(_productId, orderNo);
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
    const _productId = productId || params["frequent"];
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
  openUrl,
  closeSyn,
  jumpToHome,
  toGrade,
  changeAccount,
  getPublicParams,
};

export type { PublicParamsType };
