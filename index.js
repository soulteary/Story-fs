'use strict';
/**
 * @ref:
 *  - https://github.com/then/fs/blob/master/index.js
 *  - https://github.com/matthew-andrews/denodeify/blob/master/index.js
 * @type {Object}
 */

var fs = Object.create(require('./module/base'));
var jsonFs = require('./module/json');
var tree = require('./module/tree');

function overwriteFsByObj (src) {
    for (var key in src) {
        fs[key] = src[key];
    }
}

overwriteFsByObj(jsonFs);
overwriteFsByObj(tree);

module.exports = fs;
