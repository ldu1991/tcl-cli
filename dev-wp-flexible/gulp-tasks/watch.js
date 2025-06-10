import {watch, series} from 'gulp';
import {scssBlocks, scssDev} from './scss.js';
import cached from 'gulp-cached';
import {copyFiles} from './copy-files.js';
import {images} from './images.js';
import {libScss} from './lib-scss.js';
import {updateCss} from "./update-css.js";

export function watcher(cb) {
  watch('./**/*', series(updateCss))
  watch('./src/theme.json', series(scssDev));
  watch('./src/scss/**/*.scss', series(scssDev))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch('./src/blocks/**/*.scss', series(scssBlocks))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch(['./src/lib/**/*.scss', './src/lib/**/*.css'], series(libScss))
    .on('unlink', filepath => {
      delete cached.caches.scss[filepath];
    });
  watch(['./src/**/*.json', './src/**/*.php'], series(copyFiles));
  watch('./src/img/**/*.{jpg,jpeg,png,svg}', series(images));

  cb();
}
