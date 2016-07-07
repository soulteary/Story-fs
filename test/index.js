var assert = require('assert');
var storyFs = require('../');

for (var i in storyFs) {
    console.log(i);
}

function test (fn, message) {
    return fn()
        .then(function () {
            return new Promise(function (resolve) {
                resolve(true);
                if (message) console.info('√ ' + message);
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
    test(storyFs.mkdir.bind(null, __dirname + '/fixture'), 'mkdir'),
    test(function () {
        return storyFs.stat(__dirname + '/fixture')
            .then(function (stat) {
                assert(stat.isDirectory())
            })
    }, 'stat directory'),

    test(storyFs.writeFile.bind(null, __dirname + '/fixture/file.txt', 'hello world'), 'writeFile'),
    test(function () {
        return storyFs.readFile(__dirname + '/fixture/file.txt', 'utf8')
            .then(function (txt) {
                assert(txt === 'hello world')
            });
    }, 'readFile'),
    test(function () {
        return storyFs.readdir(__dirname + '/fixture')
            .then(function (files) {
                assert(Array.isArray(files));
                assert(files.length === 1);
                assert(files[0] === 'file.txt');
            })
    }, 'readdir'),
    test(storyFs.unlink.bind(null, __dirname + '/fixture/file.txt'), 'unlink'),

    test(function () {
        return storyFs.writeJSON(__dirname + '/fixture/file.json', {1: 2, 2: 3})
            .then(function (data) {
                assert(data === true);
            });
    }, 'writeJSON'),
    test(function () {
        return storyFs.readJSON(__dirname + '/fixture/file.json')
            .then(function (data) {
                assert(JSON.stringify(data) === JSON.stringify({1: 2, 2: 3}));
            });
    }, 'readJSON'),
    test(storyFs.unlink.bind(null, __dirname + '/fixture/file.json')),

    test(storyFs.rmdir.bind(null, __dirname + '/fixture'), 'rmdir'),
    test(function () {
        return storyFs.stat(__dirname + '/fixture')
            .then(function () {
                throw new Error('directory still exists after rmdir')
            }, function () {});
    }, 'stat directory'),

    test(function () {
        var treeCount = 0;
        return storyFs.tree({
                cwd    : process.env.PWD,
                depth  : 4,
                exclude: {
                    path: ['.git', '.idea', 'node_modules'],
                    mode: 'children'
                },
                json   : true
            }
        ).then(function (treeData) {
            if (treeData.children) {
                treeData.children.filter(function (item) {
                    if (item.name === 'index.js') {
                        treeCount++;
                        return true;
                    } else {
                        if (item.children && item.children.length) {
                            item.children.filter(function (item) {
                                if (['base.js', 'json.js', 'tree.js', 'index.js'].indexOf(item.name) > -1) {
                                    treeCount++;
                                    return true;
                                }
                            });
                        }
                    }
                });
            }
            return treeCount === 5;
        });
    }, 'tree'),

    test(function () {
        return storyFs.mkdir(__dirname + '/fixture')
            .then(storyFs.writeFile(__dirname + '/fixture/file.txt'))
            .then(storyFs.del([__dirname + '/fixture/']))
            .then(function (err) {
                if (err) return false;
                return true;
            })
    }, 'del')

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


//console.log(JSON.stringify(projectTree));
//
//
//{
//        "fullPath" : "/Users/soulteary/story/Story-fs/module",
//        "path"     : "module",
//        "name"     : "module",
//        "type"     : "directory",
//        "children" : [{
//            "fullPath" : "/Users/soulteary/story/Story-fs/module/base.js",
//            "path"     : "module/base.js",
//            "name"     : "base.js",
//            "type"     : "file",
//            "size"     : 2186
//        }, {
//            "fullPath" : "/Users/soulteary/story/Story-fs/module/json.js",
//            "path"     : "module/json.js",
//            "name"     : "json.js",
//            "type"     : "file",
//            "size"     : 2859
//        }, {
//            "fullPath" : "/Users/soulteary/story/Story-fs/module/tree.js",
//            "path"     : "module/tree.js",
//            "name"     : "tree.js",
//            "type"     : "file",
//            "size"     : 7377
//        }],
//        "size"     : 12422
//    }, {
//        "fullPath" : "/Users/soulteary/story/Story-fs/test",
//        "path"     : "test",
//        "name"     : "test",
//        "type"     : "directory",
//        "children" : [{
//            "fullPath" : "/Users/soulteary/story/Story-fs/test/index.js",
//            "path"     : "test/index.js",
//            "name"     : "index.js",
//            "type"     : "file",
//            "size"     : 2984
//        }],
//        "size"     : 2984
//    }],
//    "size"     : 18373
//}