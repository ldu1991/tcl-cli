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
 * @param string|string[] $suffix Suffix(es) — an element/modifier or array of such
 * @param string|null $base_class Base class (installation only)
 * @param bool $echo              Whether to output immediately (true) or return as a string (false)
 *
 * @return string|null
 */
function tcl_class(array|string $suffix = '', string $base_class = null, bool $echo = true): ?string
{
  static $main_class = '';

  if ($base_class !== null) {
    $main_class = get_prefix() . '-' . $base_class;
  }

  if ($main_class === '') {
    return null;
  }

  if ($suffix === '') {
    $result = $main_class;
  } elseif (is_array($suffix)) {
    $result = implode(' ', array_map(
      fn($item) => $main_class . $item,
      $suffix
    ));
  } else {
    $result = $main_class . $suffix;
  }

  if ($echo) {
    echo esc_attr($result);
    return null;
  }

  return esc_attr($result);
}
