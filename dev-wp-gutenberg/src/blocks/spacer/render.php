<?php

/*
 * $block (array) The block settings and attributes.
 * $content (string) The block inner HTML (empty).
 * $is_preview (boolean) True during backend preview render.
 * $context (array) The context provided to the block by the post or its parent block.
 */

$general_class = 'wp-custom-spacer';
$attr = get_section_options($general_class, $block, $is_preview);

$min_value = (float)get_field('min_value');
$max_value = (float)get_field('max_value'); ?>
<section class="<?php echo esc_attr(trim(implode(' ', $attr['class']))) ?>"
         style="<?php echo 'height:' . clamp($min_value, $max_value); ?>"></section>
