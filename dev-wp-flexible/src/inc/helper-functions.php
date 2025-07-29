<?php

if (!function_exists('normalize_classes')) {
  function normalize_classes($classes): array
  {
    if (is_array($classes)) {
      return $classes;
    }

    return preg_split('/\s+/', trim((string)$classes)) ?: array();
  }
}

/**
 * @param array|string $suffix
 * @param string|null $base_class
 * @param bool $include_main_class
 * @return string|null
 */
function tcl_class(array|string $suffix = '', string $base_class = null, bool $include_main_class = false): ?string
{
  static $main_class = '';

  if ($base_class !== null) {
    $main_class = get_prefix() . '-' . $base_class;
  }

  if ($main_class === '') {
    return null;
  }

  $needs_main_prefix = function ($value) {
    return preg_match('/^(_{1,2}|-{1,2})/', $value);
  };

  if ($suffix === '') {
    $result = $main_class;
  } elseif (is_array($suffix)) {
    $modifiers = array_map(function ($item) use ($main_class, $needs_main_prefix) {
      return $needs_main_prefix($item) ? $main_class . $item : $item;
    }, $suffix);
    $result    = ($include_main_class ? $main_class . ' ' : '') . implode(' ', $modifiers);
  } else {
    $result = ($include_main_class ? $main_class . ' ' : '') .
      ($needs_main_prefix($suffix) ? $main_class . $suffix : $suffix);
  }

  echo esc_attr($result);
  return null;
}

/**
 * @param $slug
 * @param $name
 * @param array $args
 * @return false|string
 */
function tcl_get_template_part_return($slug, $name = null, array $args = array())
{
  ob_start();
  get_template_part($slug, $name, $args);
  return ob_get_clean();
}

/**
 * @param string $component
 * @param array $args
 * @param bool $return
 * @return false|string|null
 */
function tcl_add_component(string $component = '', array $args = array(), bool $return = false)
{
  $componentDir = get_stylesheet_directory() . '/components/' . $component . '/';
  if (is_dir($componentDir)) {
    $renderFile = $componentDir . 'render.php';
    if (file_exists($renderFile)) {
      $uri_base = get_stylesheet_directory_uri() . '/components/' . $component . '/';
      // style.css
      $style_file = $componentDir . 'style.css';
      if (file_exists($style_file)) {
        wp_enqueue_style(
          $component . '-component',
          $uri_base . 'style.css',
          array(),
          wp_get_theme()->get('Version')
        );
      }

      // script.js
      $script_file = $componentDir . 'script.js';
      if (file_exists($script_file)) {
        wp_enqueue_script(
          $component . '-component',
          $uri_base . 'script.js',
          array(),
          wp_get_theme()->get('Version'),
          array('in_footer' => true)
        );
      }

      if ($return) {
        return tcl_get_template_part_return('components/' . $component . '/render', null, $args);
      } else {
        get_template_part('components/' . $component . '/render', null, $args);
      }
    }
  }

  return null;
}
