import {src, dest} from 'gulp';
import fs from 'fs';
import path from 'path';
import plumber from 'gulp-plumber';
import cached from 'gulp-cached';
import dependents from 'gulp-dependents';
import debug from 'gulp-debug';
import chalk from 'chalk';
import gulpIf from 'gulp-if';
import insert from 'gulp-insert';
import {additional_header_classes, style_editor_default} from './theme-data.js';
import autoprefixer from 'gulp-autoprefixer';
import sassLib from 'gulp-sass';
import * as dartSass from 'sass';

import {fileURLToPath} from 'url';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

const sass = sassLib(dartSass);

const onError = err => {
  console.error(err.message);
};

/* CSS */
export function scssDev(cb) {
  src('./src/scss/**/*.scss', {allowEmpty: true, sourcemaps: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('scss'))
    .pipe(dependents())
    .pipe(gulpIf(
      file => file.path.endsWith('style.scss'),
      insert.append(additional_header_classes),
    ))
    .pipe(sass.sync({loadPaths: ['node_modules']}))
    .pipe(gulpIf(
      file => file.path.endsWith('style-editor.scss'),
      insert.prepend(style_editor_default),
    ))
    .pipe(autoprefixer())
    .pipe(dest('css', {cwd: projectConfig.themePath, sourcemaps: true}));

  cb();
}

export function scssRelease(cb) {
  src('./src/scss/**/*.scss', {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpIf(
      file => file.path.endsWith('style.scss'),
      insert.append(additional_header_classes),
    ))
    .pipe(sass.sync({style: 'compressed', loadPaths: ['node_modules']}))
    .pipe(gulpIf(
      file => file.path.endsWith('style-editor.scss'),
      insert.prepend(style_editor_default),
    ))
    .pipe(autoprefixer())
    .pipe(dest('css', {cwd: projectConfig.themePath}));

  cb();
}

export function scssBlocks(cb) {
  src(['./src/blocks/**/*.scss', '!./src/blocks/__example/**'], {allowEmpty: true, sourcemaps: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('scss'))
    .pipe(dependents())
    .pipe(sass.sync({loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(dest('blocks', {cwd: projectConfig.themePath, sourcemaps: true}));

  cb();
}

export function scssBlocksRelease(cb) {
  src(['./src/blocks/**/*.scss', '!./src/blocks/__example/**'], {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass.sync({style: 'compressed', loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(dest('blocks', {cwd: projectConfig.themePath}));

  cb();
}

export function scssComponents(cb) {
  src(['./src/components/**/*.scss', '!./src/components/__example/**'], {allowEmpty: true, sourcemaps: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('scss'))
    .pipe(dependents())
    .pipe(sass.sync({loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(dest('components', {cwd: projectConfig.themePath, sourcemaps: true}));

  cb();
}

export function scssComponentsRelease(cb) {
  src(['./src/components/**/*.scss', '!./src/components/__example/**'], {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass.sync({style: 'compressed', loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(dest('components', {cwd: projectConfig.themePath}));

  cb();
}
