import "./utils.js"

declare global {
  var Alib: typeof MOD
  var ___init_Alib: typeof ___init
}
const MOD = {
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

function ___init()  {
  Alib.config.clear && console.clear()
  ___init_Alib_Data()
  ___init_Alib_Log()
}
global.___init_Alib = ___init