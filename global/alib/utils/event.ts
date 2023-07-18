declare global {
  var Channel: typeof _Channel
  var Flag: typeof _Flag
}

export function _Channel<Action extends Function = () => void>() {

  const _buf: Array<number> = []
  const _subs: Array<Action | null> = []

  const _unsubscribe = (index: number) => {
    _subs[index] = null
    _buf.push(index)
  }

  const subscribe = (action: Action) => {
    let _i: number
    let _bi = _buf.pop()
    if (_bi) {
      _i = _bi
      _subs[_i] = action
    } else {
      _i = _subs.length
      _subs.push(action)
    }
    let _flag = true
    return () => {
      if (_flag) {
        _unsubscribe(_i)
        _flag = false
      }
    }
  }

  const dispatch = ((...args: any) => {
    _subs.forEach((action) => action?.(...args))
  }) as any as Action

  return {
    subscribe,
    dispatch,
  }
}
global.Channel = _Channel

export function _Flag() {
  let _flag: number = 0
  const get = () => {
    return _flag
  }
  const inc = () => {
    _flag = (_flag + 1) & 0xffffffff 
  }
  return {
    get,
    inc,
  }
}
global.Flag = _Flag