import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import chalk from 'chalk';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

export async function images() {
  const sourceDir = './src/img';
  const destDir   = path.join(projectConfig.themePath, 'img');

  fs.mkdirSync(destDir, {recursive: true});

  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const sourceFile = path.join(sourceDir, file);
    const destFile   = path.join(destDir, file);

    if (fs.existsSync(destFile)) {
      //console.log(`${chalk.green.bold('Skipped existing image:')} ${sourceFile}`);
      continue;
    }

    const buffer    = fs.readFileSync(sourceFile);
    const optimized = await imagemin.buffer(buffer, {
      plugins: [
        imageminMozjpeg({quality: 85}),
        imageminOptipng({optimizationLevel: 5}),
        imageminSvgo({
          plugins: [
            {name: 'removeViewBox', active: false},
          ],
        }),
      ],
    });

    fs.writeFileSync(destFile, optimized);
    console.log(`${chalk.green.bold('Optimized and saved image:')} ${sourceFile}`);
  }

  // Copy one file from ./src to themePath
  const singleImageSrc  = './src/screenshot.png';
  const singleImageDest = path.join(projectConfig.themePath, 'screenshot.png');

  if (fs.existsSync(singleImageSrc)) {
    if (!fs.existsSync(singleImageDest)) {
      fs.copyFileSync(singleImageSrc, singleImageDest);
    }
  }
}
