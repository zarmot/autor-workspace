import { Queue } from "autor";

import { TaskList } from 'ink-task-list'

import { TaskView } from "./task.js";

export function QueueView(props: {
  queue: ReturnType<typeof Queue>,
}) {
  const { queue } = props
  const { tasks, count } = queue
  return (
    <>
      <TaskList>
        {
          tasks.map((task, index) => {
            const state = task.ctx.state
            if (state != TaskState.Idle && state != TaskState.Finished) {
              return (
                <TaskView task={task} key={index} />
              )
            }
          })
        }
      </TaskList>
      <Ink.Text>{`total: ${tasks.length} finished: ${count.finish} waiting: ${queue.get_rest()} error: ${count.error}`}</Ink.Text>
    </>
  )
}