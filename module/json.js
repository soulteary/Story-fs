/**
 * use async fs.
 * @ref https://github.com/jprichardson/node-jsonfile 2.2.3
 */

var fs = require('./base');

function readFile (file, options) {
    return fs.readFile(file, options).then(function (data) {
        return new Promise(function (resolve, reject) {
            var obj;
            var error;
            try {
                obj = JSON.parse(data, options ? options.reviver : null)
            } catch (err2) {
                err2.message = file + ': ' + err2.message;
                error = err2;
            }

            if (error) {
                reject(error);
            } else {
                resolve(obj);
            }
        });
    });
}

function readFileSync (file, options) {
    options = options || {};
    if (typeof options === 'string') {
        options = {encoding: options};
    }

    var shouldThrow = 'throws' in options ? options.throws : true;
    var content = fs.readFileSync(file, options);

    try {
        return JSON.parse(content, options.reviver);
    } catch (err) {
        if (shouldThrow) {
            err.message = file + ': ' + err.message;
            throw err;
        } else {
            return null;
        }
    }
}

function writeFile (file, obj, options, callback) {
    if (callback == null) {
        callback = options;
        options = {};
    }

    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
        ? options.spaces : this.spaces
        : this.spaces;

    var str = '';
    var error = false;

    try {
        str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
    } catch (err) {
        error = err;
    }

    if (error) {
        return new Promise(function (resolve, reject) {
            if (callback) callback(error, null);
            throw Error(error);
            reject(true);
        });
    }

    return fs.writeFile(file, str, options).then(function (data) {
        return new Promise(function (resolve) {
            if (callback) callback(data);
            resolve(true);
        });
    }).catch(function (err) {
        return err;
    });
}

function writeFileSync (file, obj, options) {
    options = options || {};

    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
        ? options.spaces : this.spaces
        : this.spaces;

    var str = JSON.stringify(obj, options.replacer, spaces) + '\n';
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options);
}

module.exports = {
    // jsonfile exports
    readJson     : readFile,
    readJSON     : readFile,
    readJsonSync : readFileSync,
    readJSONSync : readFileSync,
    writeJson    : writeFile,
    writeJSON    : writeFile,
    writeJsonSync: writeFileSync,
    writeJSONSync: writeFileSync
};