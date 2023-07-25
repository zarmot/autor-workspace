import * as fs from "fs"
import * as pt from "path"

declare global {
  var Data: MOD
  var ___init_Alib_Data: typeof ___init
  type DataDir = ReturnType<typeof Dir>
  type DataSaver = ReturnType<typeof Saver>
}

const MOD = {
  Dir,
  Saver,
}
type MOD = typeof MOD & DataDir & DataSaver
global.Data = MOD as any

function ___init() {
  const cfg = Alib.config
  const dir = Dir(`${cfg.base}/${cfg.data.base}`)
  Object.assign(Data, dir)
  const saver = Saver(dir)
  Object.assign(Data, saver)
}
global.___init_Alib_Data = ___init


function Dir(path: string) {
  let _dirmked = false
  const _dir = () => {
    if (!_dirmked) {
      fs.mkdirSync(path, { recursive: true })
      _dirmked = true
    }
  }
  const create = (file: string) => {
    _dir()
    const d = pt.dirname(file)
    d && fs.mkdirSync(`${path}/${d}`, { recursive: true })
    return fs.createWriteStream(`${path}/${file}`)
  }
  const read = async (file: string) => {
    return fs.promises.readFile(`${path}/${file}`)
  }
  return {
    create,
    read,
  }
}
function Saver(dir: DataDir) {
  const save = async (file: string, obj: any) => {
    const ws = dir.create(file)
    ws.write(JSON.stringify(obj))
    ws.end()
  }
  const load = async <T = any>(file: string) => {
    try {
      const data = await dir.read(file)
      return JSON.parse(data.toString()) as T
    } catch {
      return undefined
    }
  }
  return {
    save,
    load,
  }
}

