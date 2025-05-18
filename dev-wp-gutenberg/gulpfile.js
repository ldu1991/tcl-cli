import {series, parallel} from 'gulp';
import {scssDev, scssRelease, scssBlocks, scssBlocksRelease} from './gulp-tasks/scss.js';
import {copyFiles} from './gulp-tasks/copy-files.js';
import {images} from './gulp-tasks/images.js';
import {browserSyncInit} from './gulp-tasks/browser-sync.js';
import {watcher} from './gulp-tasks/watch.js';
import {libScss, libScssRelease} from './gulp-tasks/lib-scss.js';

export const release = series(scssRelease, scssBlocksRelease, libScssRelease, images);
export default series(scssDev, scssBlocks, libScss, copyFiles, images, parallel(browserSyncInit, watcher));
