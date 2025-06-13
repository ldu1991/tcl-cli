import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

export async function updateCss() {
  const configPath  = path.resolve(projectConfig.themePath, 'style.css');

  const style = `/*
Theme Name: ${projectConfig.themeName}
Theme URI: https://thecookielabs.com/
Author: The Cookie Labs
Author URI: https://thecookielabs.com/
Description:
Requires at least: WordPress 5.7
Template: thecookielabs
Version: ${Math.floor(new Date().getTime() / 1000)}
License:
License URI:
Text Domain: thecookielabs
Tags: one-column, flexible-header, accessibility-ready, custom-colors, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, rtl-language-support, sticky-post, threaded-comments, translation-ready
*/`;

  fs.writeFileSync(configPath, style);
}
