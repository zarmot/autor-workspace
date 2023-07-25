import * as fs from "fs/promises"

declare global {
  var File: typeof MOD
  type Dir = {
    path: string
    name: string
    dirs: Dirs
    files: string[]
  }
  type Dirs = {
    [name: string]: Dir
  }
}

const MOD = {
  scan,
}
global.File = MOD

async function scan(dirpath: string) {
  let path = dirpath
  const end1 = path.slice(-1)
  const end2 = path.slice(-2)
  const root = end2 === ":/" || end2 === ":\\"
  if (!root && (end1 === "/" || end1 === "\\")) {
    path = path.slice(0, path.length - 1)
  }
  let name = path
  if (!root) {
    let i = path.lastIndexOf("/")
    if (i < 0) {
      i = path.lastIndexOf("\\")
    }
    name = path.slice(i + 1)
  }
  return _scan(path, name)
}
async function _scan(path: string, name: string) {
  const dirs: Dirs = {}
  const files: string[] = []
  const snames = await fs.readdir(path)
  for (const i in snames) {
    const sname = snames[i]
    const spath = path + "/" + sname
    let sstat = await fs.stat(spath)
    if (sstat.isDirectory()) {
      const sub = await _scan(path + "/" + sname, sname)
      dirs[sname] = sub
    } else {
      files.push(sname)
    }
  }
  return <Dir>{
    path: path,
    name: name,
    dirs,
    files,
  }
}
