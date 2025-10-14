const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function convertPdfToJpg(pdfPath, outDir, basename = 'page', quality = 90) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(outDir, { recursive: true });
    const outPrefix = path.join(outDir, basename);
    const args = ['-jpeg', '-jpegopt', `quality=${quality}`, pdfPath, outPrefix];
    const proc = spawn('pdftoppm', args);

    let stderr = '';
    proc.stderr.on('data', d => { stderr += d.toString(); });

    proc.on('error', (err) => {
      reject(new Error('Failed to start pdftoppm: ' + err.message));
    });

    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error('pdftoppm failed: ' + stderr));
      const files = fs.readdirSync(outDir)
        .filter(f => f.startsWith(basename + '-') && f.match(/\.jpe?g$/i))
        .sort((a,b) => {
          const na = a.match(/-(\d+)\.jpe?g$/i);
          const nb = b.match(/-(\d+)\.jpe?g$/i);
          if (na && nb) return parseInt(na[1],10) - parseInt(nb[1],10);
          return a.localeCompare(b);
        })
        .map(f => path.join(outDir, f));
      resolve({ count: files.length, files });
    });
  });
}

module.exports = { convertPdfToJpg };
