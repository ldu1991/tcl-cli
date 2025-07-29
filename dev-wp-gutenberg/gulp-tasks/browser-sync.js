import browserSyncLib from 'browser-sync';
import {watch} from 'gulp';
import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

const browserSync = browserSyncLib.create();

export function browserSyncInit(cb) {
  browserSync.init({
    proxy:  projectConfig.proxy,
    notify: false,
    port:   9000,
  });

  watch(['**/*.{php,css,js,json}', '!style.css'], {cwd: projectConfig.themePath})
    .on('change', function(path, stats) {
      browserSync.reload();
    });

  cb();
}
