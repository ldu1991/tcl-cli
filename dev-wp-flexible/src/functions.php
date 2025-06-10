<?php

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
  exit('Direct script access denied.');
}

// get_template_directory();        D:/OpenServer/domains/site/wp-content/themes/my-PARENT-theme
// get_template_directory_uri();    http://site/wp-content/themes/my-PARENT-theme
// get_stylesheet_directory();      D:/OpenServer/domains/site/wp-content/themes/my-CHILD-theme
// get_stylesheet_directory_uri();  http://site/wp-content/themes/my-CHILD-theme


function get_prefix(): string
{
  return 'tcl';
}

include_once('inc/script-style-registration.php');
include_once('inc/helper-functions.php');
include_once('inc/action-config.php');
foreach (glob(get_stylesheet_directory() . '/inc/components/ui-*.php') as $component_file) {
  require_once $component_file;
}

