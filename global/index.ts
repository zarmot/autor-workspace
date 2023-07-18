export * from "./atui/index.js"
export * from "./exec/index.js"

declare global {
  var call: typeof _call
}
function _call<T>(fn: () => T) {
  return fn()
}
global.call = _call

declare global {
  var wait: typeof _wait
}
function _wait(ms: number) {
  return new Promise<void>((r) => {
    setTimeout(r, ms)
  })
}
global.wait = _wait