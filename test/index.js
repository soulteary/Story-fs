var assert = require('assert');
var noteFs = require('../');

function test (fn, message) {
    return fn()
        .then(function () {
            return new Promise(function (resolve) {
                resolve(true);
                console.info('√ ' + message);
            });
        })
        .catch(function (err) {
            return new Promise(function (resolve) {
                resolve(false);
                console.error('x ' + message);
                console.error(err.stack || err.message || err);
            });
        });
}

Promise.all([
    test(noteFs.mkdir.bind(null, __dirname + '/fixture'), 'mkdir'),
    test(function () {
        return noteFs.stat(__dirname + '/fixture')
            .then(function (stat) {
                assert(stat.isDirectory())
            })
    }, 'stat directory'),
    test(noteFs.writeFile.bind(null, __dirname + '/fixture/file.txt', 'hello world'), 'writeFile'),
    test(function () {
        return noteFs.readFile(__dirname + '/fixture/file.txt', 'utf8')
            .then(function (txt) {
                assert(txt === 'hello world')
            });
    }, 'readFile'),
    test(function () {
        return noteFs.readdir(__dirname + '/fixture')
            .then(function (files) {
                assert(Array.isArray(files));
                assert(files.length === 1);
                assert(files[0] === 'file.txt');
            })
    }, 'readdir'),
    test(noteFs.unlink.bind(null, __dirname + '/fixture/file.txt'), 'unlink'),
    test(noteFs.rmdir.bind(null, __dirname + '/fixture'), 'rmdir'),
    test(function () {
        return noteFs.stat(__dirname + '/fixture')
            .then(function () {
                throw new Error('directory still exists after rmdir')
            }, function () {});
    }, 'stat directory')
]).then(function (r) {
    if (r.some(function (r) {return r === false;})) {
        console.error('Some test suit failed.');
        process.exit(1);
    } else {
        console.info('All test passed.')
    }
}).catch(function (err) {
    console.log(err);
    process.exit(2);
});
