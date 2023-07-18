import "./utils.js"

declare global {
  var Alib: typeof MOD
}
export const MOD = {
  __init__: () => {
    Alib.config.clear && console.clear()
    Log.__init__()
    Data.__init__()
  },
  config: {
    pure: false,
    clear: true,
    base: "./.autor",
    log: {
      base: "log",
      name: <string | null> null,
      def_name: <(() => string) | null> null,
      errlog: true,
      errlog_name: "err.log",
      outlog: false,
      outlog_name: "out.log",
    },
    data: {
      base: "data",
    },
  }
}
global.Alib = MOD