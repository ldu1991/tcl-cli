import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

function dateForm() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear() % 100).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

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
Version: ${dateForm()}
License:
License URI:
Text Domain: thecookielabs
Tags: one-column, flexible-header, accessibility-ready, custom-colors, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, rtl-language-support, sticky-post, threaded-comments, translation-ready
*/`;

  fs.writeFileSync(configPath, style);
}
