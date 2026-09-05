import WebViewBridge from "./WebViewBridge";

const bridge = new WebViewBridge("ph_nexa_way_ios");

// 风控埋点
export function uploadRiskLoan(productId: string, orderNo?: string | number) {
  bridge.send("nexa_way_ejR96ofeG42gqC9", {
    ["dredge"]: productId,
    ["brisknesses"]: orderNo,
  });
}
// 跳转Scheme
export function openUrl(url: string, single?: number) {
  bridge.send("nexa_way_bLQqnOMg9PmzrYU", { ["lengthening"]: url, ["ZqUPZ8K"]: single ?? 1 });
}
// 关闭当前H5
export function closeSyn() {
  bridge.send("nexa_way_8gGtoT6O0mUSf7A");
}
// 回到App首页
export function jumpToHome() {
  bridge.send("nexa_way_ZNUXejILfzizwDD");
}
// 应用评分
export function toGrade() {
  bridge.send("nexa_way_1hdJsuLFhW550G2");
}
export function setTitle(title?: string) {
  bridge.send("nexa_way_MZhiztQYDEVfbJE", title);
}
// 更换放款账户
export function changeAccount(productId: string, orderNo?: string | number) {
  bridge.send("nexa_way_U8I08MlEvyYJLXw", {
    ["dredge"]: productId,
    ["brisknesses"]: orderNo,
  });
}
// 获取公参
export function getPublicParams(url: string, callback: (data) => void) {
  bridge.send("nexa_way_IZQjtVYVaj1VMHG", url, callback);
}
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
