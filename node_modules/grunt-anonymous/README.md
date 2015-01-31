# grunt-anonymous

> Wraps your js files/libraries into a Javascrit anonymous function

Develop and test your library or whatever, then auto-anonymize it with grunt-anonymous!

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-anonymous --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-anonymous');
```

## The "anonymous" task

### Overview
In your project's Gruntfile, add a section named `anonymous` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  anonymous: {
    dist : {
      options: {
        // Task-specific options go here.
      },
      files: {
        // Target-specific file lists and/or options go here.
      }
    }
  }
});
```

### Options

#### options.params
Type: `Array`
Default value: `null`

An array of arrays that defines the params of the anonymous function.
Example:
```js
 options : {
   params : [
      ['window','w'],
      ['document','d'],
      // ['value','name']
   ]
 },
```

### Usage Examples

#### Default Options
In this example, if the `a.js` file has the content `Some` and the `b.js` file had the content `thing`, the generated result would be `(function(){Something})();`

```js
grunt.initConfig({
  anonymous: {
    dist: {
      options: {},
      files: {
        'dest/res.js': ['a.js', 'b.js'],
      },
    }
  }
});
```

#### Custom Options
Now let's suppose you need some parameter. Considering the same files  as above, the output will be  `(function(w,d){Something})(window, document);` 

```js
grunt.initConfig({
  anonymous: {
   dist: {
    options: {
     params : [
        ['window', 'w'],
        ['document', 'd']
     ]
    },
    files: {
      'dest/res.js': ['a.js', 'b.js'],
    }
   }
  }
});
```

The output is always in a 'minified' style (No newline, spaces or stuff....)

## Contributing
Feel free to contribute!
## Release History
_(Nothing yet)_
