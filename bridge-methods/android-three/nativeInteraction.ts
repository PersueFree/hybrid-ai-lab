import sendMessage from "./FlutterView";

// 风控埋点
export function uploadRiskLoan(productId: string, orderNo?: string | number) {
  return window.PesoFunny.mark(productId, orderNo);
}
// 跳转Scheme
export function openUrl(url: string, single?: number) {
  return window.PesoFunny.navHost(url, single ?? 0);
}
// 关闭当前H5
export function closeSyn() {
  return window.PesoFunny.close();
}
// 回到App首页
export function jumpToHome() {
  return window.PesoFunny.backHome();
}
// 应用评分
export function toGrade() {
  return window.PesoFunny.review();
}
// 更换放款账户
export function changeAccount(productId?: string, orderNo?: string) {
  return window.PesoFunny.navBankList(productId, orderNo);
}
// 获取公参
export function getPublicParams(url: string) {
  return sendMessage("yes_peso_UqCapMcZIIfqoRe", url);
}
export default {
  uploadRiskLoan,
  openUrl,
  closeSyn,
  jumpToHome,
  toGrade,
  changeAccount,
  getPublicParams,
};
