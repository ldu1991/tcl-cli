<?php
/**
 * UI Button component
 * Usage:
 * ui_btn(array(
 *      'link'    => array(
 *          'url'    => '#',
 *          'title'  => '',
 *          'target' => '',
 *      ),
 *      'atts'    => array(
 *          'class' => array('btn-main', 'btn-xl'),
 *          'id'    => 'hero-btn',
 *      ),
 *      'tag'     => 'button',
 *      'return'  => false, // or true
 *      'content' => '<strong>Go</strong>' // optional, overrides title
 * ));
 */

if (!function_exists('ui_btn')) {
    /**
     * @param array $param
     * @return int|string
     */
    function ui_btn(array $param = array()): int|string
    {

        $defaults = array(
            'link'    => array(
                'url'    => '',
                'title'  => '',
                'target' => '',
            ),
            'atts'    => array(),
            'tag'     => 'a',
            'return'  => false,
            'content' => null
        );

        $param = array_replace_recursive($defaults, $param);

        $class = array_merge(
            array(get_prefix() . '-btn'),
            normalize_classes($param['atts']['class'] ?? array())
        );

        $tag     = $param['tag'];
        $title   = !empty($param['link']['title']) ? esc_html($param['link']['title']) : '';
        $content = $param['content'] ?? $title;

        $atts = array();

        if ($tag === 'a') {
            $atts['href']   = $param['link']['url'];
            $atts['target'] = (!empty($param['link']['target']) && $param['link']['target'] === '_blank') ? '_blank' : '';
        } elseif ($tag === 'button') {
            $atts['type'] = $param['atts']['type'] ?? 'button';
        }

        $atts['aria-label'] = !empty($param['link']['title']) ? esc_attr($param['link']['title']) : 'Button';

        if ($tag === 'span') {
            $atts['role'] = 'button';
        }

        $atts['class'] = esc_attr(trim(implode(' ', $class)));

        // Let's add all additional attributes except class
        foreach ($param['atts'] as $key => $value) {
            if ($key === 'class') {
                continue;
            }
            $atts[$key] = $value;
        }

        // Assembling HTML attributes
        $attributes = '';
        foreach ($atts as $attr => $value) {
            if (is_scalar($value) && $value !== '' && $value !== false) {
                $value      = ($attr === 'href') ? esc_url($value) : esc_attr($value);
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $html = "<{$tag}{$attributes}>";
        $html .= "{$content}";
        $html .= "</{$tag}>";

        return $param['return'] ? $html : print($html);
    }
}
