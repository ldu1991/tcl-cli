import {src, dest} from 'gulp';
import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

export function copyFiles() {
  return src([
    './src/**/*.php',
    './src/**/*.json',
    '!./src/acf-json/*.*',
    '!./src/blocks/__example/**'
  ], {allowEmpty: true})
    .pipe(dest(projectConfig.themePath));
}
