import React, { useRef, useReducer } from 'react'
import * as ink from 'ink'

import * as components from "./components.js"

//React
declare global {
  var React: typeof React
  var useState: typeof React.useState
  var useEffect: typeof React.useEffect
}
global.React = React
global.useState = React.useState
global.useEffect = React.useEffect

//Ink
declare global {
  var Ink: typeof ink
  var renderer: ink.Instance | null
  var render: typeof _render
}
global.Ink = ink
global.renderer = null
const _render = async function(FC: React.FC, options?: ink.RenderOptions)  {
  renderer = ink.render(<FC/>, options)
  await renderer.waitUntilExit()
}
global.render = _render

//hooks
declare global {
  var useUpdate: typeof _useUpdate
}
function __inc(v: number) {
  return (v + 1) & 0xffffffff 
}
function _useUpdate() {
  return useReducer(__inc, 0)[1]
}
global.useUpdate = _useUpdate

declare global {
  var useRefresh: typeof _useRefresh
}
function _useRefresh(until?: Promise<any>, interval = 500) {
  const update = useUpdate()
  useEffect(() => {
    const timer = setInterval(() => {
      update() 
    }, interval)
    until?.then(() => {
      update()
      clearInterval(timer)
    })
    return () => {
      clearInterval(timer)
    }
  }, [])
}
global.useRefresh = _useRefresh

declare global {
  var useScript: typeof _useScript
}
function _useScript<T>(fn: () => AsyncGenerator<T>) {
  const update = _useUpdate()
  const ref = useRef<T>()
  useEffect(() => {
    call(async () => {
      for await (const data of fn()) {
        ref.current = data
        update()
      }
    })
  }, [])
  return ref.current
}
global.useScript = _useScript

declare global {
  var useScripts: typeof _useScripts
}
function _useScripts<T>(fns: (() => AsyncGenerator<T>)[]) {
  const update = _useUpdate()
  const ref = useRef<T>()
  useEffect(() => {
    call(async () => {
      let i = 1
      let fn: () => AsyncGenerator<T> = fns[0]
      while(fn) {
        for await (const data of fn()) {
          ref.current = data
          update()
        }
        fn = fns[i]
        i += 1
      }
    })
  }, [])
  return ref.current
}
global.useScripts = _useScripts

//components
declare global {
  var Atui: typeof components
}
global.Atui = components