const sendMessage = (action, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await window.flutter_inappwebview?.callHandler(action, message);
      console.log(action, message, "data", data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export default sendMessage;