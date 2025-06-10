<?php
$term = get_queried_object();

if (is_404() && get_option('tcl_404_page')) {
  $page_id = get_option('tcl_404_page');
} else if ($term->taxonomy == 'product_cat') {
  $page_id = $term;
} else {
  $page_id = get_the_ID();
}

if (have_rows('page_sections', $page_id)) :
  while (have_rows('page_sections', $page_id)) : the_row();

    $index_row          = (int)get_row_index() - 1;
    $global_section_key = 'page_sections_' . $index_row . '_acf_save_layout';
    $global_section_id  = get_post_meta($page_id, $global_section_key, true);
    $hide_section_key   = 'page_sections_' . $index_row . '_acf_hide_layout';
    $is_section_hide    = get_post_meta($page_id, $hide_section_key, true);

    if (isset($is_section_hide) && $is_section_hide == 1) continue;

    if (isset($global_section_id) && $global_section_id) :
      if (have_rows('page_sections', $global_section_id)) :
        while (have_rows('page_sections', $global_section_id)) : the_row();

          $layout_name = str_replace('_', '-', get_row_layout());
          get_template_part('blocks/' . $layout_name . '/render');

        endwhile;
      endif;
    else :

      $layout_name = str_replace('_', '-', get_row_layout());
      get_template_part('blocks/' . $layout_name . '/render');

    endif;
  endwhile;
endif;

