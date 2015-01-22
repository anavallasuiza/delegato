/*! Delegato - v0.1.0 - 2015-01-22
* https://github.com/MiniPlugins/delegato
* Copyright (c) 2015 Berto Yáñez; Licensed MIT */

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
        var pluginName = "emissary", defaults = {};

        function Emissary (element, options) {
            this.element = element;
            this.settings = $.extend({}, defaults, options);

            this.actions = {};

            this.init();
        }

        Emissary.prototype = {
            init: function () {
                var actions = this.actions;

                $(this.element).on('click', '[data-action]', function (e) {

                    var $this = $(this);

                    var action = $this.data('action');

                    if ($this.is('input')) {
                        if (action === 'toggleClass') {
                            action = $this.is(':checked') ? 'addClass' : 'removeClass';
                        } else if (action === 'toggle') {
                            action = $this.is(':checked') ? 'show' : 'hide';
                        }
                    } else {
                        e.preventDefault();
                    }

                    var dataTarget = $this.data('target') || $this.attr('href');

                    var multipleTargets = dataTarget.split('|');

                    var targets = multipleTargets.map(function(target) {

                        var isValidSelector = function(selector) {
                            var $element;
                            try {
                                $element = $(selector);
                            } catch(e) {
                                return false;
                            }
                            return $element;
                        };

                        if (!target) {
                            target = $this;
                        } else if (target === 'parent') {
                            target = $this.parent();
                        } else if (target === 'parent-next') {
                            target = $this.parent().next();
                        } else if (target === 'next') {
                            target = $this.next();
                        } else {
                            var $target = isValidSelector(target);
                            if($target.length) {
                                target = $target;
                            }
                        }

                        return target === 'null' ? null : target;
                    });

                    $.each(action.split('|'), function (index, name) {

                        var command = name.split(':');
                        var currentAction = command.shift();
                        var currentTarget = targets[0];

                        if(targets.length > 1) {
                            currentTarget = targets[index] ? targets[index] : targets[0];
                        }

                        command.unshift(currentTarget);

                        if(actions[currentAction]) {
                            actions[currentAction].apply($this, command);
                        } else {
                            throw new Error('Action not registered');
                        }
                    });
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

        var globalInstance;

        $[pluginName] = function () {
            if (!globalInstance) {
                globalInstance = $('body');
            }

            return $.fn[pluginName].apply(globalInstance, Array.prototype.slice.call(arguments, 0));
        };
    })(jQuery, window, document);

}));