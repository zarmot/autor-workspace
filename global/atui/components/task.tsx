import { Task } from 'ink-task-list'
import spinners from 'cli-spinners'

export function TaskView(props: {
  task: Task
}) {
  const ctx = props.task.ctx
  return (
    <Ink.Box>
      <Task
        label={ctx.name ?? "Task"}
        state={call(() => {
          if (ctx.state === TaskState.Running) {
            return "loading"
          } else if (ctx.state === TaskState.Error) {
            return "error"
          } else if (ctx.state === TaskState.Aborted) {
            return "warning"
          } else {
            return "pending"
          }
        })}
        status={ctx.message as any}
        spinner={ctx.state === TaskState.Running && spinners.star as any}
      />
    </Ink.Box>
  )
}