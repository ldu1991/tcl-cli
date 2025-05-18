<?php

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
  exit('Direct script access denied.');
}

/* Action */
add_action('admin_enqueue_scripts', 'set_acf_color_palette');
add_action('after_setup_theme', 'add_theme_supports');


/* Filter */
//add_filter('acf/settings/show_admin', '__return_false'); // Hide ACF field group menu item
//add_filter('use_block_editor_for_post', '__return_false', 5);
add_filter('big_image_size_threshold', '__return_false');
//add_filter('woocommerce_enqueue_styles', '__return_empty_array');


add_action('admin_head', function () {
  global $pagenow;

  if ($pagenow === 'nav-menus.php') {
    echo '<style>#wpbody-content #menu-settings-column{display: block;position:sticky;top: 32px;}</style>';
  }
});

/**
 * Connection admin styles/scripts
 */
function set_acf_color_palette()
{
  $theme_json     = tcl_get_global_settings();
  $color_palettes = '';
  foreach ($theme_json['color']['palette'] as $color) {
    $color_palettes .= '"' . $color['color'] . '",';
  }

  wp_add_inline_script('acf-input', "acf.add_filter('color_picker_args', function (args, field) {args.palettes = [" . trim($color_palettes, ',') . "]; return args;})");
}


/**
 * Register supports
 */
function add_theme_supports()
{
  // Let WordPress manage the document title.
  add_theme_support('title-tag');

  // Enable support for Post Thumbnails on posts and pages.
  add_theme_support('post-thumbnails');

  // Register navigation menus.
  /*register_nav_menus(array(
    'header_menu' => __('Menu', 'ld'),
  ));*/

  // Add image sizes.
  //add_image_size('thumbnail-once', 480, 480, true);

  // Editor styles.
  add_theme_support('editor-styles');

  add_editor_style('assets/css/style-editor.css');
}


/**
 * @param $init
 * @return mixed
 */
function color_palettes_tiny_mce($init)
{
  $theme_json = tcl_get_global_settings();


  $color_palettes = '';
  foreach ($theme_json['color']['palette'] as $color) {
    $color_palettes .= '"' . preg_replace("/#/", "", $color['color']) . '","' . $color['name'] . '",';
  }

  $init['textcolor_map'] = '[' . $color_palettes . ']';

  $init['textcolor_rows'] = ceil(count($theme_json['color']['palette']) / 8);

  return $init;
}

add_filter('tiny_mce_before_init', 'color_palettes_tiny_mce');
