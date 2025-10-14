const { exec } = require('child_process');
const path = require('path');

function convertPdfToJpg(pdfPath, outputDir, filenamePrefix = 'page', dpi = 90) {
  return new Promise((resolve, reject) => {
    // Use pdftoppm command (Linux/Render supported)
    const cmd = `pdftoppm -jpeg -r ${dpi} "${pdfPath}" "${path.join(outputDir, filenamePrefix)}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

module.exports = { convertPdfToJpg };
