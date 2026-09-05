interface dataType {
  url?: string;
  single?: number;
  phone?: string;
  productId?: string;
  orderNo?: string | number;
}

const sendMessage = async (action: string, message?: string | dataType) => {
  try {
    const data = await window.flutter_inappwebview?.callHandler(action, message);
    console.log(action, message, "data", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default sendMessage;
