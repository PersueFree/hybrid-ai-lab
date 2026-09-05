interface dataType {
  ["hydrogenous"]?: string;
  ["TWjwikC"]?: number;
  ["psychosexuality"]?: string;
  ["hushing"]?: string | number;
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
