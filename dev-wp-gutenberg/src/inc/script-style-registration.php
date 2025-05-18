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
      wp_register_script($handle, $src, array('jquery'), wp_get_theme()->get('Version'), true);
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

  foreach (theme_get_block_folders() as $folder) {
    $folder    = wp_normalize_path($folder);
    $meta_file = trailingslashit($folder) . 'block.json';
    if (!file_exists($meta_file)) {
      continue;
    }

    $metadata   = wp_json_file_decode($meta_file, ['associative' => true]);
    $block_name = $metadata['name'] ?? '';
    if (!$block_name || !has_block($block_name)) {
      continue;
    }

    $handle_base = str_replace('/', '-', $block_name);
    $uri_base    = get_stylesheet_directory_uri() . '/blocks/' . basename($folder) . '/';

    // dependencies
    $deps_style  = $metadata['dependencies']['style'] ?? array();
    $deps_script = $metadata['dependencies']['script'] ?? array();

    // style.css
    $style_file = trailingslashit($folder) . 'style.css';
    if (file_exists($style_file)) {
      wp_enqueue_style(
        $handle_base,
        $uri_base . 'style.css',
        $deps_style,
        filemtime($style_file)
      );
    }

    // script.js
    $script_file = trailingslashit($folder) . 'script.js';
    if (file_exists($script_file)) {
      wp_enqueue_script(
        $handle_base,
        $uri_base . 'script.js',
        $deps_script,
        filemtime($script_file),
        true
      );
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
    true
  );
});

add_action('enqueue_block_editor_assets', function () {
  foreach (theme_get_block_folders() as $folder) {
    $folder    = wp_normalize_path($folder);
    $meta_file = trailingslashit($folder) . 'block.json';
    if (!file_exists($meta_file)) {
      continue;
    }

    $metadata   = wp_json_file_decode($meta_file, ['associative' => true]);
    $block_name = $metadata['name'] ?? '';
    if (!$block_name) {
      continue;
    }

    $handle_base = 'editor-' . str_replace('/', '-', $block_name);
    $uri_base    = get_stylesheet_directory_uri() . '/blocks/' . basename($folder) . '/';

    $deps_style  = $metadata['dependencies']['style'] ?? array();
    $deps_script = $metadata['dependencies']['script'] ?? array();

    $editor_style = trailingslashit($folder) . 'style.css';
    if (file_exists($editor_style)) {
      wp_enqueue_style(
        $handle_base,
        $uri_base . 'style.css',
        $deps_style,
        filemtime($editor_style)
      );
    }

    $editor_script = trailingslashit($folder) . 'script.js';
    if (file_exists($editor_script)) {
      wp_enqueue_script(
        $handle_base,
        $uri_base . 'script.js',
        $deps_script,
        filemtime($editor_script),
        true
      );
    }
  }
});
