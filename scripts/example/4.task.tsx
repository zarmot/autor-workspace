import Autor from "autor"

const autor = await Autor()

const queue = autor.Queue()
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
  useRefresh(w)
  return <Atui.QueueView queue={queue}/>
})