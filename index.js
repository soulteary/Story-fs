'use strict';
/**
 * index.js
 * 
 * @desc export api for story-fs.
 * @ref:
 *  - https://github.com/then/fs/blob/master/index.js
 *  - https://github.com/matthew-andrews/denodeify/blob/master/index.js
 * @type {Object}
 */

var fs = Object.create(require('./module/base'));
var jsonFs = require('./module/json');
var tree = require('./module/tree');
var walk = require('./module/walk');

function overwriteFsByObj (src) {
    for (var key in src) {
        fs[key] = src[key];
    }
}

overwriteFsByObj(jsonFs);
overwriteFsByObj(tree);
overwriteFsByObj(walk);

module.exports = fs;
