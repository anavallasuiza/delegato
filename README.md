# Delegato

Easily execute any javascript action directly from the html.

##Basic example

```html
<button data-action="css:background,red" data-target="#foo">Click me!</button>

<div id="foo">lorem ipsum</div>
```

Clicking the button will change the `<div>` hackground to red.


# Install

You can download delegato from this repo or install via bower:

`bower install delegato --save`

## Include files

Add dist/delegato.min.js to your code:

`<script src="path/to/delegato/dist/delegato.min.js"></script>`

Delegato depends only on jQuery, make sure jQuery is available before loading it.

### Require.js

Delegato is also compatible with RequireJS:

```js
require.config({
    paths: {
        'delegato': 'path/to/delegato/dist/delegato.min'
    }
});

...

require(['jquery', 'delegato'], function($) {
    $('body').delegato();
    //...
});
```

# Initialize

After delegato is available you need to initialize it, for example:

```
$('body').delegato();
```

You can use any jQuery selector and delegato will only affect the children elements of that selector.


# Register actions

After delegato is initialized you must register at least one action.

This is how you create an basic action:

**HTML code:**

```html
    <button data-action="actionName:hello,3" data-target=".foo">text</button>
    <span class="foo">lorem ipsum</span>
```

We are using two custom data attributes:

1. __data-action__: to define the javascript action(s) to execute and its params. In this case the action name is _actionName_ and we define two params: _hello_ and _3_
2. __data-target__: to define the target element

**JS code:**

```js

//Init delegato
$('body').delegato();

//Register action
$('body').delegato('register', 'actionName', function(event, paramA, paramB) {
    // Available variables:
    // this: the target element (a jQuery object)
    // event: the click event object that generated this acction
    // paramA: the first param
    // paramA: the second param
});
```

# jQuery actions fallback

There is a way to use delegato without defining any action: using delegato as a proxy to a subset of the jQuery API. This option is limited and buggy so you should use it only if you know what you are doing.

To use the jQuery API:

**HTML code:**

```html
    <button data-action="css:background,red" data-target=".foo">text</button>
    <span class="foo">lorem ipsum</span>
```

This action will call the .css() jQuery method. It is equivalent to: `$('.foo').css('background', 'red');`.

The main limitation is you can only use jQuery methods that take no arguments or only string based arguments. There are a bunch of them: show, hide, slideDown, fadeIn, .... Refer to the jQuery docs to know more.


# Basic usage

### Defining actions

Basic action syntax:

`<button data-action="actionName:param">`

You can define multiple params, without spaces:

`<button data-action="actionName:param1,param2,param3">`

### Multiple actions

To chain actions use the pipe character (|):

`<button data-action="actionA:param|actionB" data-target=".foo">`

### Default target and per-action targets

The selector defined in _data-target_ will be used as target for each action unless you define a custom action target.

`<button data-action="actionA:param|(.bar)actionB" data-target=".foo">`

In this case the target of _actionA_ will be _.foo_ and the target of actionB will be _.bar_

### Target syntax

You must define a target. This target can be any valid html selector in the data-target attribute (or using the per-action syntax). Also you can define targets relative to the clicked element:

- _this_: the clicked element
- _parent_: the parent of the clicked element
- _next_: the next element
- _prev_: the previous element
- _parent-next_: the parent next element
- _parent-prev_: the parent previous element

#### Find inside target

You can use this syntax to find elements inside target:

`data-target="target@target"``

For exemple:

`<button data-action="(next@.inline)actionA|actionB" data-target="#foo@strong">`

In this example we are chaining to actions:

1. actionA will have as target the elements with class .inline children of the next element of the clicked buttton.
2. actionB will have as target the strong elements children of the element with the id _foo_.

