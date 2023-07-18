import "./global/index.js"

export function init(cfg: () => void) {
  cfg?.()
  Alib.__init__()
}