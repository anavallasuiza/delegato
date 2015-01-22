/*
 * delegato
 * https://github.com/MiniPlugins/delegato
 *
 * Copyright (c) 2015 Berto Yáñez
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.delegato = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.delegato = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.delegato.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.delegato.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].delegato = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
