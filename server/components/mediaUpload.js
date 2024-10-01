
const path = require('path');
const fs = require('fs');

const uploadFileToStorage = async (file) => {
  const filePath = path.join(__dirname, '../public/uploads/', file.name);
  await fs.promises.writeFile(filePath, file.data);
  return `/uploads/${file.name}`;
};

module.exports = { uploadFileToStorage };