import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { client } from "../renkei";
import { CancelError } from "@renkei/core";
import { exhaustive } from "exhaustive";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";
import { useNavigate } from "react-router";
import { useNotification } from "../hooks/notification";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { openNotification } = useNotification();
  const navigate = useNavigate();

  const onUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const onPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const onLoginFormSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    console.log("Login submitted");

    client.login({
      input: {
        username,
        password
      }
    }).then(response => {
      if (response instanceof Error) {
        if (response instanceof CancelError) {
          setError("Request has been canceled");
          return;
        }

        setError("Bad response from the server, please try again later.");
        return;
      }

      if (!response.success) {
        exhaustive(response.error, {
          BAD_CREDENTIALS: () => {
            setError("Bad credentials, please verify your information");
          },
          STREAM_ERROR: () => {
            setError("Database corrupted, please inform your administrator");
          },
          UNEXPECTED_ERROR: () => {
            setError("An unexpected error occurred, please try again later");
          },
          CORRUPTED_DATABASE: () => {
            setError("Database corrupted, please try again or contact an administrator");
          }
        });

        return;
      }

      authenticationTokenSignal.emit(response.authenticationToken);

      openNotification({
        duration: 5000,
        message: "Successfully logged in",
        severity: "success",
      });

      navigate("/profile");
    }).catch((error) => {
      console.error(error);
      setError("Unexpected error, please try again later.");
    })
  }, [username, password, openNotification, navigate]);

  return (
    <Stack spacing={3}>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Stack spacing={3} component="form" onSubmit={onLoginFormSubmit}>
        <TextField type="text" label="User Name" value={username} onChange={onUsernameChange} />
        <TextField type="password" label="Password" value={password} onChange={onPasswordChange} />
        <Button variant="contained" sx={{ alignSelf: "center" }} type="submit">
          Login
        </Button>
      </Stack>
    </Stack>
  );
}