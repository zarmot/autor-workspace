declare global {
  var ESM: typeof MOD
}

const MOD = {
  try_load,
}
global.ESM = MOD

async function try_load(path: string) {
  let mod: any
  let err: any
  try {
    mod = await import(path)
  } catch (e) {
    err = e
  }
  return {
    mod,
    err,
  }
}
