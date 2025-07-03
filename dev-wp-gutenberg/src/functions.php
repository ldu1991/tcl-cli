<?php

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
  exit('Direct script access denied.');
}

// get_template_directory();        D:/OpenServer/domains/site/wp-content/themes/my-PARENT-theme
// get_template_directory_uri();    http://site/wp-content/themes/my-PARENT-theme
// get_stylesheet_directory();      D:/OpenServer/domains/site/wp-content/themes/my-CHILD-theme
// get_stylesheet_directory_uri();  http://site/wp-content/themes/my-CHILD-theme

remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'rsd_link');

remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head');

function tcl_get_global_settings()
{
  $json_path = get_stylesheet_directory() . '/theme.json';

  if (!file_exists($json_path)) {
    return null;
  }

  $json_data = file_get_contents($json_path);
  $parsed    = json_decode($json_data, true);

  return $parsed['settings'] ?? null;
}

function get_prefix()
{
  $json = tcl_get_global_settings();

  return $json['custom']['prefix'] ?? 'tcl';
}


function add_block_category($categories, $post): array
{
  return array_merge(
    array(
      array(
        'slug'  => 'tcl-category',
        'title' => __('TCL Blocks', get_prefix())
      )
    ),
    $categories
  );
}

add_filter('block_categories_all', 'add_block_category', 10, 2);

/**
 * @return string[] List of block directories.
 */
function theme_get_block_folders(): array
{
  return glob(get_stylesheet_directory() . '/blocks/*', GLOB_ONLYDIR) ?: array();
}

add_action('init', function () {
  foreach (theme_get_block_folders() as $folder) {
    register_block_type($folder);
  }
});


include_once('inc/script-style-registration.php');
include_once('inc/helper-functions.php');
include_once('inc/action-config.php');
foreach (glob(get_stylesheet_directory() . '/inc/components/ui-*.php') as $component_file) {
  require_once $component_file;
}
