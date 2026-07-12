const QRCode = require('qrcode');

const generateQR = async (text) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(text);
    return qrDataUrl;
  } catch (error) {
    return '';
  }
};

module.exports = { generateQR };
