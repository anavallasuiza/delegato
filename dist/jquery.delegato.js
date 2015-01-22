/*! Delegato - v0.1.0 - 2015-01-22
* https://github.com/MiniPlugins/delegato
* Copyright (c) 2015 Berto Yáñez, Óscar Otero; Licensed MIT */

// data-action="(selector)action:parameter1,parameter2,..."
// Regexp: /\(([^\)]+)\)([^:]+):([^|]+)/
// pasa a function(selector, parameter1, parameter2, ...)

(function (factory) {
    if (typeof define === 'function' && define.amd) {
    // Existe AMD.
    define(['jquery'], factory);
} else {
    // Non existe, busca en global
    factory(jQuery);
}
}(function () {

    (function ($, window, document, undefined) {
        var pluginName = "emissary",
            defaults = {
                includeJquery: false
            };

        function Emissary (element, options) {
            this.element = element;
            this.settings = $.extend({}, defaults, options);

            this.pattern = /\(([^\)]+)\)([^:|]+):?([^|]+)?/;

            this.actions = {};

            this.init();
        }

        Emissary.prototype = {
            init: function () {
                var availableActions = this.actions;
                var actionPattern = this.pattern;
                var includeJquery = this.settings.includeJquery;

                $(this.element).on('click', '[data-action]', function (e) {
                    var $this = $(this);

                    var actions = $this.data('action');

                    var isValidSelector = function(selector) {
                        var $element;
                        try {
                            $element = $(selector);
                        } catch(e) {
                            return false;
                        }
                        return $element;
                    };

                    actions.split('|').forEach(function(action) {
                        var parts = action.match(actionPattern);

                        if(parts) {
                            var selector = parts[1];
                            var command = parts[2];
                            var args = parts[3] ? parts[3].split(',') : [];

                            if(!isValidSelector(selector)) {
                                throw new Error('Invalid selector');
                            }


                            if(availableActions[command]) {
                                availableActions[command].apply($(selector), args);
                            } else if (includeJquery && $.isFunction($(selector)[command])) {
                                $(selector)[command].apply($(selector), args);
                            } else {
                                throw new Error('Malformed action');
                            }
                        }
                    });


                    e.preventDefault();

                });
            },
            register: function(name, func) {
                this.actions[name] = func;
            },
            unregister: function(name) {
                if(this.actions[name]) {
                    delete this.actions[name];
                }
            }
        };

        $.fn[pluginName] = function (options) {
            if ((options === undefined) || (typeof options === 'object')) {
                return this.each(function () {
                    if (!$.data(this, "plugin_" + pluginName)) {
                        $.data(this, "plugin_" + pluginName, new Emissary(this, options));
                    }
                });
            }

            if ((typeof options === 'string') && (options[0] !== '_') && (options !== 'init')) {
                var returns, args = arguments;

                this.each(function () {
                    var instance = $.data(this, 'plugin_' + pluginName);

                    if ((instance instanceof Emissary) && (typeof instance[options] === 'function')) {
                        returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }

                    if (options === 'destroy') {
                        $.data(this, 'plugin_' + pluginName, null);
                    }
                });

                return returns !== undefined ? returns : this;
            }
        };

    })(jQuery, window, document);

}));