/*
 * grunt-anonymous
 * https://github.com/fgnx/grunt-anonymous
 *
 * Copyright (c) 2014 FlorentMarima
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('anonymous', 'Wraps your library in an anonymous function, simply', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join('');
      grunt.log.write("Creating File ".magenta + "'".blue + f.dest.cyan + "'...".blue);
      
      // Handle options.
      var res = 'function(';
      for (var i = 0, len = options.params ? options.params.length : 0, first = true; i < len; i++) {
        res += (first ? '' : ',') + options.params[i][1];
        first = false;
      } 
      res += '){' + src + '})(';
      for (i = 0, len = options.params ? options.params.length : 0, first = true; i < len; i++)
      {
        res += (first ? '' : ',') + options.params[i][0];
        first = false;
      }
      res += ');';
      
      // Write the destination file.
      try {
        grunt.file.write(f.dest, res);
        // Print a success message.
        grunt.log.ok();
      } catch (e) { 
        // Something went wrong.
        grunt.log.error();
      }
    });
  });
};
