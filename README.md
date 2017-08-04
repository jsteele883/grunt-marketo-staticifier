# grunt-marketo-staticifier

> This is used to turn a Marketo email template back into a static template

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-marketo-staticifier --save-dev
```

```js
grunt.loadNpmTasks('grunt-marketo-staticifier');
```

## The "marketo_staticifier" task

```js example
marketo_staticifier: {
    main: {
        files: [{
            expand: true,
            cwd: './v2/',
            dest:'./v2/static/',
            src: ['email-template_rvsc-integration.html']
        }]
    }
},

// add a watch task ------
watch: {
    // watch the integrated marketo file ---------
    html: {
        files: ['./v2/*.html'],
        tasks: ['marketo_staticifier']
    }
}
```
