declare global {
  var Tasks: typeof MOD
  type Task = ReturnType<typeof New>
  const enum TaskState {
    Idle, 
    Running,
    Error,
    Aborted,
    Finished,
  }
  type TaskHooks = {
    get_state: () => TaskState
    set_progress: (p: number) => void
    set_message: (msg: string | null) => void
    set_abort: (fn: (() => void) | null) => void
    error: (err: string) => void
  }
  type Queue = ReturnType<typeof Queue>
}
const MOD = {
  New,
  Queue,
}
global.Tasks = MOD

function New(fn: (hooks: TaskHooks) => Promise<void>, name?: string) {
  const ctx = {
    name,
    state: TaskState.Idle,
    progress: -1,
    message: <string | null> null,
    abort: <(() => void) | null> null,
  }
  const hooks: TaskHooks = {
    get_state() {
      return ctx.state
    },
    set_progress(p) {
      ctx.progress = p
    },
    set_message(msg) {
      ctx.message = msg
    },
    set_abort(fn) {
      ctx.abort = fn
    },
    error(err) {
      ctx.state = TaskState.Error
      ctx.message = err
    },
  }
  const run = async () => {
    ctx.state = TaskState.Running
    try {
      await fn(hooks)
      // @ts-ignore
      if (ctx.state != TaskState.Error && ctx.state != TaskState.Aborted) {
        ctx.state = TaskState.Finished
      }
    } catch (err) {
      hooks.error("Error: " + err)
    }
  }

  return {
    ctx,
    hooks,
    run,
  }
}

function Queue() {
  let _index = 0
  const tasks: Task[] = []
  function get_index() {
    return _index
  }
  function is_finished() {
    return tasks.length == _index
  }
  function push(task: Task) {
    tasks.push(task)
  }
  function task(fn: (hooks: TaskHooks) => Promise<void>, name?: string) {
    push(New(fn, name))
  }

  function _next(): Task | undefined {
    let task: Task | undefined = tasks[_index]
    _index < tasks.length && _index++
    while (task && task.ctx.state != TaskState.Idle) {
      task = tasks[_index]
      _index++
    }
    return task
  }

  const count = {
    running: 0,
    finish: 0,
    error: 0,
    abort: 0,
  }
  function get_rest() {
    return tasks.length - count.running - count.finish - count.error - count.abort
  }
  async function _run() {
    let task = _next()
    while(task) {
      count.running += 1
      await task.run()
      count.running -= 1
      if (task.ctx.state === TaskState.Finished) {
        count.finish += 1
      } else if (task.ctx.state === TaskState.Error) {
        count.error += 1
      } else if (task.ctx.state === TaskState.Aborted) {
        count.abort += 1
      }
      task = _next()
    }
  }
  async function run(count = 1) {
    let cache: Promise<void>[] = []
    for (let i = 0; i < count; i++) {
      cache.push(_run())
    }
    while (cache.length > 0) {
      await cache.pop()
    }
  }

  return {
    tasks,
    get_index,
    is_finished,
    push,
    task,
    count,
    get_rest,
    run
  }
}