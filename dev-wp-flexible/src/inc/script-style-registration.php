<?php
add_action('enqueue_block_editor_assets', 'set_modules');
add_action('wp_enqueue_scripts', 'set_modules');
function set_modules()
{
  $style_library = array(//'swiper' => get_stylesheet_directory_uri() . '/assets/css/lib/swiper.css'
  );

  $script_library = array(//'swiper' => get_stylesheet_directory_uri() . '/assets/lib/swiper-bundle.min.js'
  );

  if (!empty($style_library)) {
    foreach ($style_library as $handle => $src) {
      wp_register_style($handle, $src, array(), wp_get_theme()->get('Version'));
    }
  }

  if (!empty($script_library)) {
    foreach ($script_library as $handle => $src) {
      wp_register_script($handle, $src, array('jquery'), wp_get_theme()->get('Version'), array('in_footer' => true));
    }
  }

  /* *** LOCAL SCRIPTS *** */
  wp_localize_script('jquery', 'tcl_ajax',
    array(
      'url'    => admin_url('admin-ajax.php'),
      'nonce'  => wp_create_nonce('wpajax-noncecode'),
      'prefix' => get_prefix()
    )
  );
}


add_action('wp_enqueue_scripts', function () {
  if (is_404() && get_option('tcl_404_page')) {
    $page_id = get_option('tcl_404_page');
  } else {
    $page_id = get_the_ID();
  }

  /* *** STYLES *** */
  wp_enqueue_style(
    get_prefix() . '-style',
    get_stylesheet_directory_uri() . '/assets/css/style.css',
    array(),
    wp_get_theme()->get('Version')
  );
  wp_enqueue_style(
    get_prefix() . '-header',
    get_stylesheet_directory_uri() . '/assets/css/header.css',
    array(),
    wp_get_theme()->get('Version')
  );


  $page_sections = get_post_meta($page_id, 'page_sections', true);
  if ($page_sections) {
    foreach ($page_sections as $section) {
      $section_name = str_replace('_', '-', $section);
      $folder       = get_stylesheet_directory() . '/blocks/' . $section_name . '/';
      $meta_file    = $folder . '/block.json';

      if (!file_exists($meta_file)) {
        continue;
      }
      $metadata = wp_json_file_decode($meta_file, ['associative' => true]);
      $uri_base = get_stylesheet_directory_uri() . '/blocks/' . $section_name . '/';

      // dependencies
      $deps_style  = $metadata['dependencies']['style'] ?? array();
      $deps_script = $metadata['dependencies']['script'] ?? array();


      // style.css
      $style_file = $folder . 'style.css';
      if (file_exists($style_file)) {
        wp_enqueue_style(
          $section_name,
          $uri_base . 'style.css',
          $deps_style,
          wp_get_theme()->get('Version')
        );
      }

      // script.js
      $script_file = $folder . 'script.js';
      if (file_exists($script_file)) {
        wp_enqueue_script(
          $section_name,
          $uri_base . 'script.js',
          $deps_script,
          wp_get_theme()->get('Version'),
          array('in_footer' => true)
        );
      }
    }
  }

  wp_enqueue_style(
    get_prefix() . '-footer',
    get_stylesheet_directory_uri() . '/assets/css/footer.css',
    array(),
    wp_get_theme()->get('Version')
  );

  /* *** SCRIPTS *** */
  wp_enqueue_script(
    get_prefix() . '-script',
    get_stylesheet_directory_uri() . '/assets/js/script.js',
    array('jquery'),
    wp_get_theme()->get('Version'),
    array('in_footer' => true)
  );
});
