var delFs = require('del');

var syncDel = delFs.sync;
var asyncDel = delFs;
delete asyncDel.sync;

module.exports = {
    del    : asyncDel,
    syncDel: syncDel
};