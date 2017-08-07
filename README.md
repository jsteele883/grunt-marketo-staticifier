# grunt-marketo-staticifier

> Converts an integrated Marketo email template into a static version, so that you may work on the integrated version, while testing with the static version

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-marketo-staticifier --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-marketo-staticifier');
```

## Boilerplate to get started quickly
see Github repo
https://github.com/Michael-vanderHaas/marketo-staticifier-boilerplate

## The "marketo_staticifier" task

### Overview
In your project's Gruntfile, add a section named `marketo_staticifier` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  marketo_staticifier: {
    build: {
        files: {
            './templates-static/example1-static.html' : './templates-marketo/example1-integrated.html',
            './templates-static/example2-static.html' : './templates-marketo/example2-integrated.html'
            // add extra file [dest : src] here
        }
    }
  },
});
```

### HTML
Please ensure you wrap all of your Marketo <meta> tags with a custom 'comments'...
```html
<!-- marketo start -->
    <meta class="mktoColor" id="body_bgc" mktoName="Body background colour" default="#f5f5f5">
    <meta class="mktoColor" id="row_bgc" mktoName="Row background colour" default="#ffffff">
<!-- marketo end -->
```

