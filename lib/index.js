'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sighCore = require('sigh-core');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var statAsync = _bluebird2['default'].promisify(_fs2['default'].stat);

exports['default'] = function (op, basePath, targetType) {
  return op.stream.flatMap(function (_originalEvents) {
    return _sighCore.Bacon.fromPromise(_bluebird2['default'].filter(_originalEvents, function (event) {
      if (event.type !== "add" && event.type !== "change") {
        return true;
      }
      var targetFileName = _path2['default'].join(basePath, _path2['default'].dirname(event.path), targetType ? _path2['default'].basename(event.path, '.' + event.fileType) + '.' + targetType : _path2['default'].basename(event.path));
      return _bluebird2['default'].all([statAsync(event.sourcePath), statAsync(targetFileName)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var sourceStat = _ref2[0];
        var targetStat = _ref2[1];
        return targetStat.mtime.getTime() < sourceStat.mtime.getTime();
      })['catch'](function (e) {
        return true;
      });
    }).then(function (events) {
      (0, _sighCore.log)(events.length, "files to process in found", _originalEvents.length);
      return events;
    }));
  });
};

module.exports = exports['default'];
//# sourceMappingURL=index.js.map