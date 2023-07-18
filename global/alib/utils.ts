import "./utils/cmd.js"
import "./utils/data.js"
import "./utils/esm.js"
import "./utils/event.js"
import "./utils/file.js"
import "./utils/log.js"
import "./utils/task.js"
import "./utils/web.js"

declare global {
  var call: typeof _call
}
export function _call<T>(fn: () => T) {
  return fn()
}
global.call = _call

declare global {
  var wait: typeof _wait
}
export function _wait(ms: number) {
  return new Promise<void>((r) => {
    setTimeout(r, ms)
  })
}
global.wait = _wait