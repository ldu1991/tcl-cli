/**
 * is jQuery
 * @param obj
 * @returns {*}
 */
export const isjQuery = (obj) => (obj instanceof jQuery ? obj[0] : obj);

/**
 * is Even
 * @param num
 * @returns {boolean}
 */
export const isEven = (num) => num % 2 === 0;

/**
 * Video Adaptive Resize
 * @param elements
 * @param className
 */
export const videoResize = (elements, className) => {
  function wrapperVideo(parent, className) {
    const wrapper = document.createElement('div');
    if (className !== undefined) wrapper.classList = className;
    wrapper.setAttribute('style', 'position: absolute;top: 0;left: 0;width: 100%;height: 100%;overflow: hidden;');

    parent.parentNode.insertBefore(wrapper, parent);
    wrapper.appendChild(parent);
  }

  document.querySelectorAll(elements).forEach((el) => {
    wrapperVideo(el, className);

    let fnResize = () => {
      // Get a native video size
      let videoHeight = el.videoHeight;
      let videoWidth = el.videoWidth;

      // Get a wrapper size
      let wrapperHeight = el.parentNode.offsetHeight;
      let wrapperWidth = el.parentNode.offsetWidth;

      if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
        el.setAttribute(
          'style',
          'width:' +
            (wrapperWidth + 3) +
            'px;height:auto;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);'
        );
      } else {
        el.setAttribute(
          'style',
          'width:auto;height:' +
            (wrapperHeight + 3) +
            'px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);'
        );
      }
    };

    fnResize();
    window.addEventListener('resize', fnResize);
  });
};

/**
 * Render Block
 * @param type
 * @param fn
 */
export const renderBlock = (type = '', fn) => {
  if (typeof wp !== 'undefined' && typeof wp.domReady !== 'undefined' && wp.data.select('core/editor')) {
    wp.domReady(() => {
      if (
        typeof wp.data !== 'undefined' &&
        typeof wp.data.select('core/editor') !== 'undefined' &&
        typeof acf !== 'undefined'
      ) {
        let blockElement = (el) => {
          let element = isjQuery(el).querySelector('.' + wp_ajax.prefix + '-' + type);
          return !!element ? element : isjQuery(el);
        };
        acf.addAction('render_block_preview/type=' + type, (el) => fn(blockElement(el), true));
      }
    });
  } else {
    document.querySelectorAll('.' + wp_ajax.prefix + '-' + type).forEach((el) => fn(el, false));
  }
};

/**
 * Fluid-responsive
 * @param min_size
 * @param max_size
 * @param min_viewport
 * @param max_viewport
 * @returns {string}
 */
export const clamp = (min_size, max_size, min_viewport = 576, max_viewport = 1400) => {
  const view_port_width_offset = min_viewport / 100 / 16 + 'rem';
  const size_difference = max_size - min_size;
  const viewport_difference = max_viewport - min_viewport;
  const linear_factor = ((size_difference / viewport_difference) * 100).toFixed(4);

  const fluid_target_size = min_size / 16 + 'rem + ((1vw - ' + view_port_width_offset + ') * ' + linear_factor + ')';

  let result = '';

  if (min_size === max_size) {
    result = min_size / 16 + 'rem';
  } else if (min_size > max_size) {
    result = 'clamp(' + max_size / 16 + 'rem, ' + fluid_target_size + ', ' + min_size / 16 + 'rem)';
  } else if (min_size < max_size) {
    result = 'clamp(' + min_size / 16 + 'rem, ' + fluid_target_size + ', ' + max_size / 16 + 'rem)';
  }

  return result;
};

/**
 * Paginate Links
 * @param paginateWrap
 * @param total
 * @param current
 */
export const paginateLinks = (paginateWrap, total, current) => {
  if (total > 1) {
    let page_links = '';

    let prev_class = current && 1 < current ? 'prev' : 'paginate-none';
    page_links += '<button class="' + prev_class + '" data-page="' + (current - 1) + '">Previous</button>';

    let dots = false;
    page_links += '<div class="paginate-wrap">';
    for (let n = 1; n <= total; n++) {
      if (n === current) {
        page_links += '<div class="current">' + n + '</div>';

        dots = true;
      } else {
        if (n <= 1 || (current && n >= current - 1 && n <= current + 1) || n > total - 1) {
          page_links += '<button class="page-numbers" data-page="' + n + '">' + n + '</button>';

          dots = true;
        } else if (dots) {
          page_links += '<div class="dots">&hellip;</div>';

          dots = false;
        }
      }
    }
    page_links += '</div>';

    let next_class = current && current < total ? 'next' : 'paginate-none';
    page_links += '<button class="' + next_class + '" data-page="' + (current + 1) + '">Next</button>';

    paginateWrap.style.display = '';
    paginateWrap.innerHTML = page_links;
  } else {
    paginateWrap.style.display = 'none';
    paginateWrap.innerHTML = '';
  }
};
