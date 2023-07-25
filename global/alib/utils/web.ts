import { type } from "os"
import { exec } from "child_process"

declare global {
  var Web: typeof MOD
}

const MOD = {
  open,
}
global.Web = MOD

function open(url: string) {
  switch (type()) {
    case "Linux":
      exec(`xdg-open ${url}`)
      break
    case "Windows_NT":
      exec(`explorer ${url}`)
      break
    case "Darwin":
      exec(`open ${url}`)
      break
  }
}
