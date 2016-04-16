import _ from 'lodash'
import Promise from 'bluebird'
import { Bacon, log } from 'sigh-core'
import fs from 'fs'
import path from 'path'

const statAsync = Promise.promisify(fs.stat)

export default function(op, basePath, targetType) {
  return op.stream.flatMap(_originalEvents => Bacon.fromPromise(
    Promise.filter(
      _originalEvents,
      event => {
        if (event.type !== "add" && event.type !== "change") {
          return true;
        }
        let targetFileName = path.join(
          basePath,
          path.dirname(event.path),
          targetType
            ? path.basename(event.path, '.'+event.fileType) + '.' + targetType
            : path.basename(event.path)
        )
        return Promise.all([
          statAsync(event.sourcePath),
          statAsync(targetFileName)
        ]).then(([sourceStat, targetStat]) =>
          targetStat.mtime.getTime() < sourceStat.mtime.getTime()
        ).catch(e => true)
      }
    ).then(events => {
      log(events.length, "files to process in found", _originalEvents.length)
      return events
    })
  ))
}
