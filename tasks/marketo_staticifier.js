/*
 * grunt-marketo-staticifier
 * https://github.com/Michael-vanderHaas/grunt-marketo-staticifier
 *
 * Copyright (c) 2017 Michael van der Haas
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('marketo_staticifier', 'Converts an integrated Marketo email template into a static version, so that you may work on the integrated version, while testing with the static version', function() {

      var metaArray = []; // this will become an array of meta tag, still as strings
      var metaObj = [];
      var origHtml = '',
          newHtml = '';

      // write new static file
      var writeOriginal = function( filePath, fileContent ) {
          if ( grunt.file.write( filePath, fileContent.toString().trim() ) ) {
              grunt.log.ok( "Awesome,  \"" + filePath + "\" is now static." );
              return true;
          } else {
              grunt.log.warn( "Bugger, she's rooted mate. \"" + filePath + "\"" );
              return false;
          }
      };


      function makeNewHtml(){
          newHtml = origHtml;
          for(var i=0;i<metaObj.length;i++){
              if(metaObj[i].id) {
                  // if no default, lets jsut leave it empty
                  if(!metaObj[i].default) metaObj[i].default = "";
                  // update html
                  newHtml = newHtml.replace('${' + metaObj[i].id + '}', metaObj[i].default);
              }
          }
          //writeOriginal(file.dest + file.src[0], newHtml);
          writeOriginal('./v2/static/email-template_rvsc-integration.html', newHtml);
      }

      function getAttr(str1, attr){
          var pos1 = str1.indexOf(attr+'="') + 2 + attr.length;
          if(pos1>0){
              var str2 = str1.slice(pos1),
                  pos2 = str2.indexOf('"');
              return str2.slice(0,pos2);
          }
      }


      function makeMetaObj(arr){
          // build a nice obj from each str
          for(var i=0;i<arr.length;i++){
              //console.log(arr);
              var item = {};
              item.id = getAttr(arr[i], 'id');
              item.default = getAttr(arr[i], 'default');
              item.default = getAttr(arr[i], 'default');
              var units = getAttr(arr[i], 'units');
              if(units && units.length && units !== '=') item.default = getAttr(arr[i], 'default') + units;

              //console.log(item);
              metaObj.push(item);
          }
          // new we can make our new html
          makeNewHtml();
      }


      function makeMetaArray(str){
          var pos1 = str.indexOf('<meta'),
              str1 = str.slice(pos1 + 5),
              pos2 = str1.indexOf('<meta');

          if(pos1 > 0 && pos2 > 0){
              // push into array
              var metaStr = str1.slice(0,pos2),
                  remainderStr = str1.slice(pos2 - 6);

              metaArray.push(metaStr);
              // repeat wih the new remainder str
              makeMetaArray(remainderStr);
          } else {
              // we have finished building the array,
              // lets turn this into the obj
              if(makeMetaArray.length) makeMetaObj(metaArray);
          }
      }



      function headOnly(str) {
          var start = str.indexOf('<!-- marketo start -->'),
              end = str.indexOf('<!-- marketo end -->'),
              _str = str.slice(start, end);
          if (start > 0 && end > start) makeMetaArray(_str);
      }


      var fileExists = function (src) {
          if (!grunt.file.exists(src)) {
              grunt.log.error("Source file \"" + src + "\" not found.");
              return false;
          }
          return true;
      };

      // get the content ---------------------
      this.files.forEach(function (file) {
          if (fileExists(file.src[0])) {
              origHtml = grunt.file.read(file.src[0]);
              headOnly(origHtml);
          } else {
              grunt.log.warn('The file "' + file.src[0] + '" was not found.');
          }
      });


  });

};
