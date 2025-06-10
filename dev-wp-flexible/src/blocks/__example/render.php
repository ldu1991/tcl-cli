<?php
tcl_class('', '__NAME__', false);
$unique_id     = get_sub_field('unique_id') ?: '';
$bottom_margin = get_sub_field('bottom_margin');

$class_modifier = array();
if ($bottom_margin) {
  $class_modifier[] = '--margin-bottom-' . $bottom_margin;
}
?>
<section id="<?php echo $unique_id; ?>"
         class="<?php tcl_class($class_modifier) ?>">
  <div class="<?php tcl_class('__wrapper') ?>">

  </div>
</section>

