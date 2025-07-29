import {src, dest} from 'gulp';
import cached from 'gulp-cached';
import newer from 'gulp-newer';
import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

export function copyFiles() {
  const fontPath = path.resolve('./src/fonts');

  if (fs.existsSync(fontPath)) {
    const fontDest = path.join(projectConfig.themePath, 'fonts');
    src('./src/fonts/**/*', {allowEmpty: true})
      .pipe(newer(fontDest))
      .pipe(cached('fonts'))
      .pipe(dest('fonts', {cwd: projectConfig.themePath}))
  }

  return src([
    './src/**/*.php',
    './src/**/*.json',
    '!./src/acf-json/*.*',
    '!./src/blocks/__example/**'
  ], {allowEmpty: true})
    .pipe(newer(projectConfig.themePath))
    .pipe(cached('php-json'))
    .pipe(dest(projectConfig.themePath));
}
