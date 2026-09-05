import sendMessage from "./FlutterView";

// 风控埋点
export function uploadRiskLoan(productId: string, orderNo?: string | number) {
  return sendMessage("vera_point_LUXemypt7s49GKF", { ["psychosexuality"]: productId, ["hushing"]: orderNo });
}
// 跳转safari
export function openGooglePlay(appPkg: string) {
  return sendMessage("vera_point_kFDyE7hg7lu2b8J", appPkg);
}
// 跳转Scheme
export function openUrl(url: string, single?: number) {
  return sendMessage("vera_point_4y4HigDc1j62TMh", { ["hydrogenous"]: url, ["TWjwikC"]: single ?? 1 });
}
// 关闭当前H5
export function closeSyn() {
  return sendMessage("vera_point_TcH3JtwRKwZ53yP");
}
// 回到App首页
export function jumpToHome() {
  return sendMessage("vera_point_6bv1i98T38jIOgl");
}
// 应用评分
export function toGrade() {
  return sendMessage("vera_point_bdzcZrDcMqToIXf");
}
// 更换放款账户
export function changeAccount(productId?: string, orderNo?: string) {
  return sendMessage("vera_point_KuqcJLRZI9rJUCZ", { ["psychosexuality"]: productId, ["hushing"]: orderNo });
}
// 获取公参
export function getPublicParams(url: string) {
  return sendMessage("vera_point_gRa8MP3YJ2wPMsP", url);
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
