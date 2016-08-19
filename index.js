'use strict';
/**
 * index.js
 *
 * @description export api for story-fs.
 * @see https://github.com/then/fs/blob/master/index.js
 * @see https://github.com/matthew-andrews/denodeify/blob/master/index.js
 * @type {Object}
 */

var fs = Object.create(require('./module/base'));
var jsonFs = require('./module/json');
var tree = require('./module/tree');
var walk = require('./module/walk');
var mkdirs = require('./module/mkdirs');
var del = require('./module/del');

function overwriteFsByObj(srcList) {
  for (var i = 0, j = srcList.length; i < j; i++) {
    for (var key in srcList[i]) {
      fs[key] = srcList[i][key];
    }
  }
}

overwriteFsByObj([jsonFs, tree, walk, mkdirs, del]);

module.exports = fs;
