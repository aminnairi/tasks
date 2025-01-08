import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { client } from "../renkei";
import { useSignal } from "@aminnairi/react-signal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";
import { exhaustive } from "exhaustive";
import { CancelError } from "@renkei/core";
import { useNotification } from "../hooks/notification";

export const ProjectsCreatePage = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const authenticationToken = useSignal(authenticationTokenSignal);
  const { openNotification } = useNotification();

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const onProjectFormSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    client.createProject({
      input: {
        authenticationToken,
        name
      }
    }).then(response => {
      if (response instanceof Error) {
        if (response instanceof CancelError) {
          setError("Request canceled");
          return;
        }

        setError("Unexpected error, please try again later.");
        return;
      }

      if (response.success) {
        // TODO: redirect to project management page

        openNotification({
          duration: 5000,
          message: "Project created successfully",
          severity: "success",
        });
        return;
      }

      exhaustive(response.error, {
        CORRUPTION_ERROR: () => {
          setError("Database corrupted, please contact your administrator");
        },
        PROJECT_NAME_ALREADY_EXISTS: () => {
          setError("Project name already exists, please use another one");
        },
        PROJECT_NAME_TOO_SHORT: () => {
          setError("Project name is too short and should be at least three characters long");
        },
        STREAM_ERROR: () => {
          setError("Failed to parse events while retrieving the list of events, please contact your administrator");
        },
        UNAUTHORIZED: () => {
          setError("You must be authenticated before creating a project");
        },
        UNEXPECTED_ERROR: () => {
          setError("Unexpeted error, please try again later or contact your administrator");
        }
      });
    }).catch(error => {
      console.error(error);
      setError(`Unexpected error: ${error}`);
    });
  }, [name, authenticationToken]);

  return (
    <Stack spacing={3}>
      <Typography align="center" variant="h4">
        New Project
      </Typography>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Stack spacing={3} component="form" onSubmit={onProjectFormSubmit}>
        <TextField label="Name" value={name} onChange={onNameChange} />
        <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
          Create
        </Button>
      </Stack>
    </Stack>
  );
};