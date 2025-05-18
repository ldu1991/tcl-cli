<?php

/*
 * $block (array) The block settings and attributes.
 * $content (string) The block inner HTML (empty).
 * $is_preview (boolean) True during backend preview render.
 * $context (array) The context provided to the block by the post or its parent block.
 */

$general_class = '__class_block__';
$attr          = get_section_options($general_class, $block, $is_preview);
if (has_preview_screenshot($block, '')) return;

$filed = get_field('filed');
?>

<section <?php echo $attr['id_attr']; ?>
  class="<?php echo esc_attr(trim(implode(' ', $attr['class']))) ?>">


</section>
