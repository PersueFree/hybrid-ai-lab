import WebViewBridge from "./WebViewBridge";

const bridge = new WebViewBridge("ph_pera_rise_ios");
// 风控埋点
export function uploadRiskLoan(productId: string, orderNo?: string | number) {
  bridge.send("pera_rise_jjh5s4L3SsOtR2y", { ["monacidic"]: productId, ["swager"]: orderNo });
}
// 跳转Scheme
export function openUrl(appPkg: string) {
  bridge.send("pera_rise_80WyB5ctVbs3FRr", appPkg);
}
// 跳转safari
export function openGooglePlay(url: string) {
  bridge.send("pera_rise_yzyL9jiTSXDU8zO", url);
}
// 关闭当前H5
export function closeSyn() {
  bridge.send("pera_rise_b9JpvntpXs2EDdv");
}
// 回到App首页
export function jumpToHome() {
  bridge.send("pera_rise_fHwJhVAAtE6J2sX");
}
// 应用评分
export function toGrade() {
  bridge.send("pera_rise_KBEABbJw8iRR0CO");
}
// 放款重试弹窗
export function retryOrderDialog(orderNo: string | number) {
  bridge.send("pera_rise_bGg5lYcqliaE92Y", { ["swager"]: orderNo });
}
// 更换放款账户
export function changeAccount(productId?: string, orderNo?: string | number) {
  bridge.send("pera_rise_kjKyI647Yf5Hx2e", { ["monacidic"]: productId, ["swager"]: orderNo });
}
// 获取公参
export function getPublicParams(url: string, callback: (data) => void) {
  bridge.send("pera_rise_u83svTnfY9DMI0B", { ["imposters"]: url }, callback);
}
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
