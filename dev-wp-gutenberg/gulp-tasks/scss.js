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
export function scssDev() {
  return src('./src/scss/**/*.scss', {allowEmpty: true, sourcemaps: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('scss'))
    .pipe(dependents())
    // .pipe(debug({
    //   title: '', logger: message => {
    //     console.log(chalk.green.bold('SCSS compiled:') + message);
    //   },
    // }))
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
}

export function scssRelease() {
  return src('./src/scss/**/*.scss', {allowEmpty: true})
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
}

export function scssBlocks() {
  return src(['./src/blocks/**/*.scss', '!./src/blocks/__example/**'], {allowEmpty: true, sourcemaps: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('scss'))
    .pipe(dependents())
    // .pipe(debug({
    //   title: '', logger: message => {
    //     console.log(chalk.green.bold('SCSS compiled:') + message);
    //   },
    // }))
    .pipe(sass.sync({loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(dest('blocks', {cwd: projectConfig.themePath, sourcemaps: true}));
}

export function scssBlocksRelease() {
  return src(['./src/blocks/**/*.scss', '!./src/blocks/__example/**'], {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass.sync({style: 'compressed', loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(dest('blocks', {cwd: projectConfig.themePath}));
}
