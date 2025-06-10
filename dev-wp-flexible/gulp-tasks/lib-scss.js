import {src, dest} from 'gulp';
import fs from 'fs';
import path from 'path';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import sassLib from 'gulp-sass';
import * as dartSass from 'sass';

import {fileURLToPath} from 'url';
import cached from 'gulp-cached';
import dependents from 'gulp-dependents';
import merge2 from 'merge2';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

const sass = sassLib(dartSass);

const onError = err => {
  console.error(err.message);
};

export function libScss() {
  const scssStream = src('./src/lib/**/*.scss', {allowEmpty: true, sourcemaps: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('scss'))
    .pipe(dependents())
    .pipe(sass.sync({loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min', extname: '.css'}))
    .pipe(dest('lib', {cwd: projectConfig.themePath, sourcemaps: true}));

  const cssStream = src('./src/lib/**/*.css', {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(cached('css'))
    .pipe(dependents())
    .pipe(dest('lib', {cwd: projectConfig.themePath}));

  return merge2(scssStream, cssStream);
}


export function libScssRelease() {
  const scssStream = src('./src/lib/**/*.scss', {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass.sync({style: 'compressed', loadPaths: ['node_modules']}))
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min', extname: '.css'}))
    .pipe(dest('lib', {cwd: projectConfig.themePath}));

  const cssStream = src('./src/lib/**/*.css', {allowEmpty: true})
    .pipe(plumber({errorHandler: onError}))
    .pipe(dest('lib', {cwd: projectConfig.themePath}));

  return merge2(scssStream, cssStream);
}
