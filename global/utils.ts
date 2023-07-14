declare global {
  var call: typeof _call
  var wait: typeof _wait
}
function _call<T>(fn: () => T) {
  return fn()
}
global.call = _call

function _wait(ms: number) {
  return new Promise<void>((r) => {
    setTimeout(r, ms)
  })
}
global.wait = _wait