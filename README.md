# Delegato

jQuery plugin to easily execute any javascript action directly from the html.

##Basic example

Clicking the button will scroll the page to the #foo div.


```html
<button data-action="scroll:fast" data-target="#foo">Scroll to #foo!</button>

<!-- more html elements -->

<div id="foo">lorem ipsum</div>
```

```js
$('body').delegato();

$('body').delegato('register', 'scroll', function(e, speed) {
    // 'this' is binded to the jQuery object of the button data-target value: $('#foo')
    return $('html, body').animate({
        scrollTop: this.offset().top - 120
    }, speed);
});

```

# Install

You can download delegato from this repo or install it via bower:

`bower install delegato --save`

Then, import the jquery and delegato scripts into your html code and initialize the plugin:

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/delegato/dist/delegato.min.js"></script>

<script type="text/javascript">
    $('body').delegato();
</script>
```

## AMD support

Delegato is also compatible with AMD, for example, RequireJS:

```js
require.config({
    paths: {
        'delegato': 'path/to/delegato/dist/delegato.min'
    }
});
...

require(['jquery', 'delegato'], function($) {
    
    //Init the plugin
    $('body').delegato();

});
```

# How it works?

Delegato attachs handlers to the click event for all elements containing the `data-action` attribute. Let's take this example of basic interaction:

```html
<a id="content-btn" href="#content">See the content</a>

<div id="content" class="hidden">
This is the hidden content. On click in the link above, the content should be showed.
</div>

<script type="text/javascript">
    $('#content-btn').on('click', function (e) {
        e.preventDefault();

        var target = $(this).attr('href');

        $(target).slideDown('slow');
    });
</script>
```

With delegato, this can be done just with html:

```html
<a id="content-btn" data-action="slideDown:slow" href="#content">See the content</a>

<div id="content" class="hidden">
This is the hidden content. On click in the link above, the content should be showed.
</div>
```

Delegato register the click event in all elements with the `data-action` attribute and execute the callbacks defined there.

## Targets:

The target is the element that receive the actions and it's get from the `href` or `data-target` atributes of the clicked element. It can be a valid css selector but there are some special keywords for targets relative to the clicked element:

**this** | the clicked element itself
**parent** | The target is the parent
**next** | The target is the next sibling
**prev** | The target is the previous sibling
**parent-next** | The target is the next sibling of the parent.
**parent-prev** | The target is the previous sibling of the parent.


## Register actions

The examples above shows jquery functions. This is because delegato can register automatically these functions for you. There are a bunch of them: show, hide, slideDown, fadeIn, .... Refer to the jQuery docs to know more. But you can register also your own functions.

```js

//Init delegato
$('body').delegato({
    includeJquery: true //register the jquery functions
});

//Register a new action
$('body').delegato('register', 'actionName', function(event, paramA, paramB) {
    // Available variables:
    // this: the jquery object of the target element ($('.foo'))
    // event: the click event object that generated this action
    // paramA: the first param (hello)
    // paramA: the second param (3)
});
```

Now you can execute this functions from your html code:

```html
<button data-action="actionName:hello,3" data-target=".foo">text</button>
<span class="foo">lorem ipsum</span>
```

# Examples

Basic action syntax:

```html
<button data-action="actionName:param">
```

You can define multiple params, without spaces:

```html
<button data-action="actionName:param1,param2,param3">
```

Multiple actions. To chain actions use a vertical bar (pipe):

```html
<button data-action="actionA:param|actionB" data-target=".foo">
```

The selector defined in `data-target` will be used as target for each action unless you define a custom action target.

Syntax: `(optional-target)actionName:params,...`

```html
<button data-action="actionA:param|(.bar)actionB" data-target=".foo">
```

In this case the target of _actionA_ will be `.foo` and the target of _actionB_ will be `.bar`

## Find inside target

You can use this syntax to find elements inside target:

`data-target="target@target"``

For exemple:

`<button data-action="(next@.inline)actionA|actionB" data-target="#foo@strong">`

In this example we are chaining to actions:

1. actionA will have as target the elements with class .inline children of the next element of the clicked buttton.
2. actionB will have as target the strong elements children of the element with the id _foo_.
