
(function() {

  if (window.location.search.indexOf('rtl=true') > -1) {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  if (window.location.search.indexOf('ionic:_testing=true') > -1) {
    const style = document.createElement('style');
    style.innerHTML = `
* {
  caret-color: transparent !important;
}`;
    document.head.appendChild(style);
  }

  window.Gic = window.Gic || {};
  window.Gic.config = window.Gic.config || {};

})();