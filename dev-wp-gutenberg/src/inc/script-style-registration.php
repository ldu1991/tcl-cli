<?php
add_action('enqueue_block_editor_assets', 'set_modules');
add_action('wp_enqueue_scripts', 'set_modules');
function set_modules()
{
  $style_library = array(
    //'swiper' => get_stylesheet_directory_uri() . '/assets/css/lib/swiper.css'
  );

  $script_library = array(
    //'swiper' => get_stylesheet_directory_uri() . '/assets/lib/swiper-bundle.min.js'
  );

  if (!empty($style_library)) {
    foreach ($style_library as $handle => $src) {
      wp_register_style(
        $handle,
        $src,
        array(),
        wp_get_theme()->get('Version')
      );
    }
  }

  if (!empty($script_library)) {
    foreach ($script_library as $handle => $src) {
      wp_register_script(
        $handle,
        $src,
        array('jquery'),
        wp_get_theme()->get('Version'),
        array('in_footer' => true)
      );
    }
  }

  /* *** LOCAL SCRIPTS *** */
  wp_localize_script('jquery', 'wp_ajax',
    array(
      'url'    => admin_url('admin-ajax.php'),
      'nonce'  => wp_create_nonce('wpajax-noncecode'),
      'prefix' => get_prefix()
    )
  );
}


add_action('wp_enqueue_scripts', function () {
  /* *** STYLES *** */
  wp_enqueue_style(
    get_prefix() . '-style',
    get_stylesheet_directory_uri() . '/css/style.css',
    array(),
    wp_get_theme()->get('Version')
  );
  wp_enqueue_style(
    get_prefix() . '-header',
    get_stylesheet_directory_uri() . '/css/header.css',
    array(),
    wp_get_theme()->get('Version')
  );
  wp_enqueue_style(
    get_prefix() . '-footer',
    get_stylesheet_directory_uri() . '/css/footer.css',
    array(),
    wp_get_theme()->get('Version')
  );


  /* *** SCRIPTS *** */
  wp_enqueue_script(
    get_prefix() . '-script',
    get_stylesheet_directory_uri() . '/js/script.js',
    array('jquery'),
    wp_get_theme()->get('Version'),
    array('in_footer' => true)
  );
});
