import { getQueryParams } from "./getQueryParams";
import nativeInteraction from "./nativeInteraction";

interface PublicParamsType {
  ["rowan"]: string | number;
  ["derisivenesses"]?: string;
  ["shooed"]?: string;
  ["acropolises"]?: string;
  ["urinometer"]?: string;
  ["seizins"]?: string;
  ["spittles"]?: string;
  ["lobbers"]?: string;
  ["parachutic"]?: string | number;
  ["eyetooth"]?: string;
}

export function uploadRiskLoan(orderNo?: string | number, productId?: string) {
  try {
    const params = getQueryParams();
    const _productId = productId || params["dredge"];
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
    const _productId = productId || params["dredge"];
    nativeInteraction.changeAccount(_productId, String(orderNo || ""));
  } catch (e) {
    console.error(e);
  }
}

export function setTitle(title?: string) {
  try {
    nativeInteraction.setTitle(title);
  } catch (e) {
    console.error(e);
  }
}

export const getPublicParams = async (url: string, callback: (data: PublicParamsType) => void) => {
  try {
    nativeInteraction.getPublicParams(url, callback);
  } catch (e) {
    console.error(e);
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
  setTitle,
};

export type { PublicParamsType };
