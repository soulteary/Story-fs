'use strict';
/**
 * @see https://github.com/then/fs/blob/master/index.js
 * @see https://github.com/matthew-andrews/denodeify/blob/master/index.js
 * @type {Object}
 */

var fs = Object.create(require('fs'));

/**
 * denodeify
 *
 * @param {function} nodeStyleFunction
 * @param {function} filter
 * @returns {Function}
 */
function denodeify(nodeStyleFunction, filter) {
  return function() {
    var self = this;
    var functionArguments = new Array(arguments.length + 1);

    for (var i = 0; i < arguments.length; i += 1) {
      functionArguments[i] = arguments[i];
    }

    function promiseHandler(resolve, reject) {
      function callbackFunction() {
        var args = new Array(arguments.length);

        for (var i = 0; i < args.length; i += 1) {
          args[i] = arguments[i];
        }

        if (filter) {
          args = filter.apply(self, args);
        }

        var error = args[0];
        var result = args[1];

        if (error) {
          return reject(error);
        }
        return resolve(result);
      }

      functionArguments[functionArguments.length - 1] = callbackFunction;
      nodeStyleFunction.apply(self, functionArguments);
    }

    return new Promise(promiseHandler);
  };
}

/**
 * overwrite fs' functions.
 *
 * @param {string} key
 */
function overwrite(key) {
  var fn = fs[key];
  if (key !== 'exists') {
    fs[key] = denodeify(fn);
  } else {
    fs[key] = function() {
      var args = [].slice.call(arguments);
      return new Promise(function(resolve) {
        args.push(resolve);
        fn.apply(null, args);
      });
    };
  }
}

/**
 * isSyncFs
 *
 * @param {string} name
 * @returns {boolean}
 */
function isSyncFs(name) {
  if (name.match(/Sync$/) || name.match(/^[A-Z]/) || name.match(/^create/) || name.match(/^(un)?watch/)) {
    return true;
  } else {
    return false;
  }
}

for (var key in fs) {
  if (!(typeof fs[key] != 'function' || isSyncFs(key))) {
    overwrite(key);
  }
}

module.exports = fs;
