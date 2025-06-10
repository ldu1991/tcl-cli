import {isEven, isjQuery, videoResize} from './app/functions.js';

(function($) {
})(jQuery);

// ------------ Deleting placeholder focus ------------ //
function focusFnInput(target) {
  if (target.getAttribute('placeholder') !== null) {
    target.setAttribute('data-placeholder', target.getAttribute('placeholder'));
    target.setAttribute('placeholder', '');
  }
}

document.addEventListener(
  'focus',
  function(event) {
    for (let target = event.target; target && target !== this; target = target.parentNode) {
      if (target.matches('input, textarea')) {
        focusFnInput.call(this, target, event);
        break;
      }
    }
  },
  true,
);

function blurFnInput(target) {
  if (target.getAttribute('data-placeholder') !== null) {
    target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
  }
}

document.addEventListener(
  'blur',
  function(event) {
    for (let target = event.target; target && target !== this; target = target.parentNode) {
      if (target.matches('input, textarea')) {
        blurFnInput.call(this, target, event);
        break;
      }
    }
  },
  true,
);
// ---------- End Deleting placeholder focus ---------- //
