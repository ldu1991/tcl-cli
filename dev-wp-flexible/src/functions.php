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

add_action('wp_enqueue_scripts', function () {
  wp_dequeue_style('wp-block-library');
  wp_dequeue_style('wp-block-library-theme');
  wp_dequeue_style('wc-block-style');
});

function get_prefix(): string
{
  return 'tcl';
}

include_once('inc/script-style-registration.php');
include_once('inc/helper-functions.php');
include_once('inc/action-config.php');
