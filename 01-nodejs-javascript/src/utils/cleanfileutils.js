const fs = require('fs');
const path = require('path');

const deleteSpecificFiles = (folderPath, fileTypes) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteSpecificFiles(curPath, fileTypes); 
      } else {
        const fileExtension = path.extname(file).toLowerCase();
        if (fileTypes.includes(fileExtension)) {
          fs.unlinkSync(curPath);
        }
      }
    });
  }
};

module.exports = { deleteSpecificFiles };
