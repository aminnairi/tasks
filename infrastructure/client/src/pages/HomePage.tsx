import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react"
import { CancelError } from "@renkei/core";
import { client } from "../renkei";
import { exhaustive } from "exhaustive";
import { TasksResponse } from "@todo/application/responses/TasksResponse"
import { useSignal } from "@aminnairi/react-signal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";

export const HomePage = () => {
  const [tasks, setTasks] = useState<TasksResponse>([]);
  const [error, setError] = useState("");

  const authenticationToken = useSignal(authenticationTokenSignal);

  useEffect(() => {
    client.listTasks({
      input: {
        authenticationToken: authenticationToken
      }
    }).then(response => {
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
          setError("An error with fetching events from the stream occurred, please try again later");
          return;
        },
        UNEXPECTED_ERROR: () => {
          setError("An unexpected error occurred, please try again later");
          return;
        },
        UNAUTHORIZED_ERROR: () => {
          setError("You cannot display tasks because you are not or have been recently disconnected");
          return;
        }
      });
    }).catch(error => {
      console.error(error);
      setError("An unexpected error occurred, please try again later");
    });
  }, [authenticationToken]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" align="center">
        Tasks
      </Typography>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      {tasks.length === 0 ? (
        <Typography align="center">
          No tasks available.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.identifier}>
                  <TableCell>{task.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}