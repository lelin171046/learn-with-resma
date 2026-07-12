const slug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const uniqueSlug = async (Model, text) => {
  let base = slug(text);
  let slugValue = base;
  let counter = 1;
  while (await Model.findOne({ slug: slugValue })) {
    slugValue = `${base}-${counter}`;
    counter++;
  }
  return slugValue;
};

const generateInvoiceNumber = () => {
  const date = new Date();
  const prefix = 'LWR';
  const timestamp = date.getFullYear().toString().slice(-2) + 
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

const generateCertificateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LWR-CERT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = { slug, uniqueSlug, generateInvoiceNumber, generateCertificateId };
