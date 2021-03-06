/*
 * grunt-marketo-staticifier
 * https://github.com/todo
 *
 * Copyright (c) 2017 Michael van der Haas
 * Licensed under the MIT license.
 */

'use strict';


var _path = require('path');



module.exports = function (grunt) {
    grunt.registerMultiTask('marketo_staticifier', 'Builds a non-integrated (static) html version of a marketko email template for testing changes.', function () {

        // replaceAll used to search the html
        String.prototype.replaceAll = function (find, replace) {
            var str = this;
            return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
        };


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



        function makeNewHtml(file){
            newHtml = origHtml;
            for(var i=0;i<metaObj.length;i++){
                if(metaObj[i].id) {
                    // if no default, lets jsut leave it empty
                    if(!metaObj[i].default) metaObj[i].default = "";
                    // update html
                    newHtml = newHtml.replaceAll( '${' + metaObj[i].id + '}', metaObj[i].default);
                }
            }
            // make valid hrefs
            newHtml = newHtml.replaceAll('href="mktoString"', 'href="www.rcracer.co.nz"');

            // remove classes
            newHtml = newHtml.replaceAll('class="mobile-view mktoModule"', 'class="mobile-view"');
            newHtml = newHtml.replaceAll('class="mktoModule"', '');
            newHtml = newHtml.replaceAll('class="mktoContainer"', '');
            
            // rename id's
            newHtml = newHtml.replaceAll('id="', 'data-id="');

            // change classNames,id's etc
            newHtml = newHtml.replaceAll('mkto', 'data-mkto');
            writeOriginal(file.dest, newHtml);
        }


        function getAttr(str1, attr){
            var pos1 = str1.indexOf(attr+'="') + 2 + attr.length;
            if(pos1>0){
                var str2 = str1.slice(pos1),
                    pos2 = str2.indexOf('"');
                return str2.slice(0,pos2);
            }
        }


        function makeMetaObj(arr, file){
            // build a nice obj from each str
            for(var i=0;i<arr.length;i++){
                var item = {};
                item.id = getAttr(arr[i], 'id');
                item.default = getAttr(arr[i], 'default');
                item.default = getAttr(arr[i], 'default');
                var units = getAttr(arr[i], 'units');
                if(units && units.length && units !== '=') item.default = getAttr(arr[i], 'default') + units;
                // push into obj
                metaObj.push(item);
            }
            // new we can make our new html
            makeNewHtml(file);
        }


        function makeMetaArray(str, file){

            var pos1 = str.indexOf('<meta'),
                str1 = str.slice(pos1 + 5),
                pos2 = str1.indexOf('<meta');

            if(pos1 > 0 && pos2 > 0){
                // push into array
                var metaStr = str1.slice(0,pos2),
                    remainderStr = str1.slice(pos2 - 6);

                metaArray.push(metaStr);
                // repeat wih the new remainder str
                makeMetaArray(remainderStr, file);
            } else {

                // if there is one meta left, lets grab that...
                if(pos1 > 0 ) metaArray.push(str1);

                // we have finished building the array,
                // lets turn this into the obj
                if(metaArray.length) makeMetaObj(metaArray, file);
            }
        }



        function headOnly(str, file) {
            var start = str.indexOf('<!-- marketo start -->'),
                end = str.indexOf('<!-- marketo end -->'),
                _str = str.slice(start, end);
            if (start > 0 && end > start) makeMetaArray(_str, file);
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
                headOnly(origHtml, file);
            } else {
                grunt.log.warn('The file "' + file.src[0] + '" was not found.');
            }
        });


    });
};
