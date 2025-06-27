import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
import archiver from "archiver"

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../dev-wp-flexible');
const outputZip = path.resolve(__dirname, 'archives/dev-wp-flexible.zip');

const output  = fs.createWriteStream(outputZip);
const archive = archiver('zip', {
  zlib: {level: 8}
});

output.on('close', () => {
  console.log(`Archive created: ${outputZip} (${archive.pointer()} byte)`);
});

archive.on('warning', err => {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);

archive.glob('**/*', {
  cwd:    sourceDir,
  ignore: ['node_modules/**', 'package-lock.json', 'project-config.json', 'src/style.css'],
  dot:    true
});

archive.finalize();
