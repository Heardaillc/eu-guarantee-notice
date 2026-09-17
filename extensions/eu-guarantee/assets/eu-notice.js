/**
 * Optional hover-to-open behaviour for the EU guarantee notice.
 *
 * The regulation allows a nested display as long as the full notice appears on
 * the first click, roll-over or tactile expansion. Click already works natively
 * via <details>; this adds roll-over on pointer devices without breaking
 * keyboard or touch use.
 */
(function () {
  'use strict';

  var OPEN_DELAY = 60;
  var CLOSE_DELAY = 220;

  function supportsHover() {
    return window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function wire(details) {
    if (details.dataset.eugHoverWired === '1') return;
    details.dataset.eugHoverWired = '1';

    var openTimer = null;
    var closeTimer = null;

    function clearTimers() {
      if (openTimer) { window.clearTimeout(openTimer); openTimer = null; }
      if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null; }
    }

    details.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      clearTimers();
      openTimer = window.setTimeout(function () {
        details.open = true;
      }, OPEN_DELAY);
    });

    details.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      clearTimers();
      // Leave it open if the shopper opened it deliberately.
      if (details.dataset.eugPinned === '1') return;
      closeTimer = window.setTimeout(function () {
        details.open = false;
      }, CLOSE_DELAY);
    });

    details.addEventListener('toggle', function () {
      if (details.open && details.dataset.eugUserToggled === '1') {
        details.dataset.eugPinned = '1';
      }
      if (!details.open) {
        details.dataset.eugPinned = '0';
      }
      details.dataset.eugUserToggled = '0';
    });

    var summary = details.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', function () {
        details.dataset.eugUserToggled = '1';
      });
      summary.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          details.dataset.eugUserToggled = '1';
        }
      });
    }
  }

  function init() {
    if (!supportsHover()) return;
    var nodes = document.querySelectorAll('.eug-details');
    for (var i = 0; i < nodes.length; i++) {
      wire(nodes[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Themes that swap sections without a page load (section rendering API).
  document.addEventListener('shopify:section:load', init);
})();
