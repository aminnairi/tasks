import { useEffect, useState } from "react"
import { CancelError } from "@renkei/core";
import { client } from "./renkei";
import { exhaustive } from "exhaustive";
import { TasksResponse } from "@todo/application/responses/TasksResponse"

function App() {
  const [tasks, setTasks] = useState<TasksResponse>([]);

  useEffect(() => {
    client.listTasks({ input: null }).then(response => {
      if (response instanceof Error) {
        if (response instanceof CancelError) {
          return;
        }

        return;
      }

      if (response.success) {
        setTasks(response.tasks);
        return;
      }

      return exhaustive(response.error, {
        STREAM_ERROR: () => {
          return;
        },
        UNEXPECTED_ERROR: () => {
          return;
        }
      });
    })
  }, []);

  return (
    <table>
      <tbody>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : tasks.map(task => (
          <tr key={task.identifier}>
            <td>{task.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App
