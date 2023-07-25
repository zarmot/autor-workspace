import * as fs from "fs"
import * as pt from "path"

declare global {
  var Log: MOD
  var ___init_Alib_Log: typeof ___init
  type LogDir = ReturnType<typeof Dir>
}

const MOD = {
  Dir,
}
type MOD = typeof MOD & LogDir & {
  err: ReturnType<typeof _Errlog>
  out: ReturnType<typeof _Outlog>
}
global.Log = MOD as any

function ___init() {
  const cfg = Alib.config
  const logger = Dir(`${cfg.base}/${cfg.log.base}/${cfg.log.name ?? cfg.log.def_name?.() ?? _def_name()}`)
  Object.assign(Log, logger)
  Log.err = _Errlog(logger, cfg.log.errlog_name)
  !cfg.pure && cfg.log.errlog && Log.err.enable()
  Log.out = _Outlog(logger, cfg.log.outlog_name)
  !cfg.pure && cfg.log.outlog && Log.out.enable()
}
global.___init_Alib_Log = ___init

function _def_name() {
  const time = new Date()
  const YY = time.getFullYear().toString().slice(-2)
  const MM = ("00" + (time.getMonth() + 1)).slice(-2)
  const DD = ("00" + time.getDate()).slice(-2)
  const hh = ("00" + time.getHours()).slice(-2)
  const mm = ("00" + time.getMinutes()).slice(-2)
  const ss = ("00" + time.getSeconds()).slice(-2)
  const ms = ("000" + time.getMilliseconds()).slice(-3)
  return `${YY}${MM}${DD}/${hh}${mm}_${ss}${ms}`
}
function Dir(path: string) {
  let _dirmked = false
  const _dir = () => {
    if (!_dirmked) {
      fs.mkdirSync(path, { recursive: true })
      _dirmked = true
    }
  }

  const open = (file: string, options?: any) => {
    _dir()
    const d = pt.dirname(file)
    d && fs.mkdirSync(`${path}/${d}`, { recursive: true })
    return fs.createWriteStream(`${path}/${file}`, options)
  }
  const open_console = (file: string, errfile?: string, options?: any) => {
    _dir()
    const fsw = open(file, options)
    if (errfile) {
      const efsw = open(errfile, options)
      return new console.Console(fsw, efsw)
    } else {
      return new console.Console(fsw)
    }
  }
  const open_xconsole = (file: string, errfile?: string, options?: any) => {
    _dir()
    let _console: Console
    const fsw = open(file, options)
    if (errfile) {
      const efsw = open(errfile, options)
      _console = new console.Console(fsw, efsw)
    } else {
      _console = new console.Console(fsw)
    }

    const xconsole: Omit<Console, "Console"> = {} as any
    for (const key in console) {
      (xconsole as any)[key] = (...args: any) => {
        (console as any)[key](...args)
        return (_console as any)[key](...args)
      }
    }
    return xconsole
  }

  const write = async (file: string, data: Parameters<typeof fs.promises.writeFile>[1], options?: any) => {
    _dir()
    const d = pt.dirname(file)
    d && fs.mkdirSync(`${path}/${d}`, { recursive: true })
    return fs.promises.writeFile(`${path}/${file}`, data, options)
  }
  const append = async (file: string, data: Parameters<typeof fs.promises.appendFile>[1], options?: any) => {
    _dir()
    const d = pt.dirname(file)
    d && fs.mkdirSync(`${path}/${d}`, { recursive: true })
    return fs.promises.appendFile(`${path}/${file}`, data, options)
  }
  
  return {
    open,
    open_console,
    open_xconsole,
    write,
    append,
  }
}

const IGNORE1 = Buffer.from([27, 91, 63, 50, 53, 108])
const IGNORE2 = Buffer.from([27, 91, 63, 50, 53, 104])
function _Errlog(dir: LogDir, file: string) {
  let _enable = false
  const is_enable = () => _enable

  const _stderrw = process.stderr.write
  const _xwrite = (...args: any) => {
    let _pass = true
    try {
      if (Buffer.compare(IGNORE1, Buffer.from(args[0])) === 0) {
        _pass = false     
      }
      if (Buffer.compare(IGNORE2, Buffer.from(args[0])) === 0) {
        _pass = false     
      }
    } catch {}
    if (_pass) {
      const _err = dir.open(file, {flags:'a'})
      _err.write.apply(_err, args)
      _err.end()
    }
    return _stderrw.apply(process.stderr, args)
  }
  const _onerr = (err: any) => {
    console.error(err)
  }
  const enable = () => {
    _enable = true
    process.on("uncaughtException", _onerr)
    process.stderr.write = _xwrite
  }
  const disable = () => {
    _enable = false
    process.removeListener("uncaughtException", _onerr)
    process.stderr.write = _stderrw
  }
  return {
    is_enable,
    enable,
    disable,
  }
}
function _Outlog(dir: LogDir, file: string) {
  let _enable = false
  const is_enable = () => _enable

  let _log: fs.WriteStream | null = null 
  let _logw = <any | null> null
  const _stdoutw = process.stdout.write
  const _xwrite = (...args: any) => {
    if (!_log) {
      _log = dir.open(file)
      _logw = _log.write
    }
    _logw.apply(_log, args)
    return _stdoutw.apply(process.stdout, args)
  }
  const enable = () => {
    _enable = true
    process.stdout.write = _xwrite
  }
  const disable = () => {
    _enable = false
    process.stdout.write = _stdoutw
  }
  return {
    is_enable,
    enable,
    disable,
  }
}
