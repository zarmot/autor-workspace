import "autor"

const queue = Tasks.Queue()
for (let index = 0; index < 50; index++) {
  queue.task(async (hooks) => {
    hooks.set_message("waiting...")
    await wait(1000)
    if (index === 10) {
      hooks.error("example error")
    }
  }, `Task${index + 1}`)
}
const w = queue.run(5)
await render(() => {
  //timed rerender until promise resolve
  useRefresh(w, 500)
  return <Atui.QueueView queue={queue}/>
})