import sendMessage from "./FlutterView";

// 风控埋点
export function uploadRiskLoan(productId: string, orderNo?: string | number) {
  return sendMessage("sure_vida_erqCWEuwaAivXOB", { ["bulking"]: productId, ["superweapon"]: orderNo });
}
// 跳转safari
export function openGooglePlay(appPkg: string) {
  return sendMessage("sure_vida_uIjnhTJnwqrrNnt", appPkg);
}
// 跳转Scheme
export function openUrl(url: string, single?: number) {
  return sendMessage("sure_vida_ubRpIfZla63jvAx", { ["analogousness"]: url, ["fP8CwCl"]: single ?? 1 });
}
// 关闭当前H5
export function closeSyn() {
  return sendMessage("sure_vida_QLgvU7Phm2qosDw");
}
// 回到App首页
export function jumpToHome() {
  return sendMessage("sure_vida_W5WBMPzO4Mgck2o");
}
// 应用评分
export function toGrade() {
  return sendMessage("sure_vida_jrhSg77yaUCF8Gv");
}
// 更换放款账户
export function changeAccount(productId?: string, orderNo?: string | number) {
  return sendMessage("sure_vida_mvFpJgFD2gneG57", { ["bulking"]: productId, ["superweapon"]: orderNo });
}
// 获取公参
export function getPublicParams(url: string) {
  return sendMessage("sure_vida_u6XaGzPoY4Nzi8q", url);
}
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
