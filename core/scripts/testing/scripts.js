
(function() {

  if (window.location.search.indexOf('rtl=true') > -1) {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  window.Gic = window.Gic || {};
  window.Gic.config = window.Gic.config || {};
  window.Gic.config.experimentalTransitionShadow = true;

})();
