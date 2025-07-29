import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import {watch, series} from 'gulp';
import {scssBlocks, scssComponents, scssDev} from './scss.js';
import cached from 'gulp-cached';
import {copyFiles} from './copy-files.js';
import {images} from './images.js';
import {libScss} from './lib-scss.js';
import {updateCss} from "./update-css.js";
import {syncAcfJson} from "./sync-acf-json.js";

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

export function watcher(cb) {
  watch('./src/**/*', series(updateCss))
  watch('./src/theme.json', series(scssDev));
  watch('./src/scss/**/*.scss', series(scssDev))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch('./src/blocks/**/*.scss', series(scssBlocks))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch('./src/components/**/*.scss', series(scssComponents))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch(['./src/lib/**/*.scss', './src/lib/**/*.css'], series(libScss))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch(['./src/**/*.json', './src/**/*.php', '!./src/acf-json/*.json'], series(copyFiles));
  watch('./src/img/**/*.{jpg,jpeg,png,svg}', series(images));
  watch(`${projectConfig.themePath}/acf-json/*.json`, series(syncAcfJson));

  cb();
}
