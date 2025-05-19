import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const createStyleCss = (projectName) => {
  const configPath  = path.resolve('dev-wp/src/style.css');
  //const name = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-');

  const configContent = `/*
Theme Name: ${projectName}
Theme URI: https://thecookielabs.com/
Author: The Cookie Labs
Author URI: https://thecookielabs.com/
Description:
Requires at least: WordPress 5.7
Template: thecookielabs
License:
License URI:
Text Domain: thecookielabs
Tags: one-column, flexible-header, accessibility-ready, custom-colors, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, rtl-language-support, sticky-post, threaded-comments, translation-ready
*/`;

  fs.writeFileSync(configPath, configContent);
  console.log(chalk.green(`style.css generated successfully!`));
};
