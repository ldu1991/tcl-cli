import {series, parallel} from 'gulp';
import {
  scssDev,
  scssRelease,
  scssBlocks,
  scssBlocksRelease,
  scssComponents,
  scssComponentsRelease
} from './gulp-tasks/scss.js';
import {copyFiles} from './gulp-tasks/copy-files.js';
import {images} from './gulp-tasks/images.js';
import {browserSyncInit} from './gulp-tasks/browser-sync.js';
import {watcher} from './gulp-tasks/watch.js';
import {libScss, libScssRelease} from './gulp-tasks/lib-scss.js';
import {syncAcfJson} from "./gulp-tasks/sync-acf-json.js";

export const release = series(scssRelease, scssBlocksRelease, scssComponentsRelease, libScssRelease, images, syncAcfJson);
export default series(scssDev, scssBlocks, scssComponents, libScss, copyFiles, images, syncAcfJson, parallel(browserSyncInit, watcher));
