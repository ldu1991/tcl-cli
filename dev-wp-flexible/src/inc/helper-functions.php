<?php

if (!function_exists('normalize_classes')) {
    function normalize_classes($classes): array
    {
        if (is_array($classes)) {
            return $classes;
        }

        return preg_split('/\s+/', trim((string) $classes)) ?: array();
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
    $result = ($include_main_class ? $main_class . ' ' : '') . implode(' ', $modifiers);
  } else {
    $result = ($include_main_class ? $main_class . ' ' : '') .
      ($needs_main_prefix($suffix) ? $main_class . $suffix : $suffix);
  }

  echo esc_attr($result);
  return null;
}
