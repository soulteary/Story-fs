'use strict';

module.exports = {
  mkdirs: require('./mkdirs'),
  mkdirsSync: require('./mkdirs-sync'),
  // alias
  mkdirp: require('./mkdirs'),
  mkdirpSync: require('./mkdirs-sync'),
  ensureDir: require('./mkdirs'),
  ensureDirSync: require('./mkdirs-sync')
};