import fs from 'fs';
import path from 'path';

export const createStartTheme = (projectName) => {
  const name = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-');
  const themePath = path.resolve(`wp-content/themes/${name}`);
  const stylePath = path.join(themePath, 'style.css');
  const indexPath = path.join(themePath, 'index.php');

  if (!fs.existsSync(themePath)) {
    fs.mkdirSync(themePath, {recursive: true});
  }

  // Adding style.css
  const style = `/*
Theme Name: ${projectName}
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
  fs.writeFileSync(stylePath, style);

  // Adding index.php
  const index = `<?php

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
  exit('Direct script access denied.');
}

get_header();

while (have_posts()) : the_post();

  the_content();

endwhile;

get_footer();`;
  fs.writeFileSync(indexPath, index);
}
