import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Outlet } from "react-router";
import { useSignal } from "@aminnairi/react-signal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";
import { useCallback, useMemo } from "react";
import { isAdministratorSignal } from "../signals/isAdministratorSignal";

export const WithoutAuthentication = () => {
  const authenticationToken = useSignal(authenticationTokenSignal);
  const authenticated = useMemo(() => !!authenticationToken, [authenticationToken]);

  const logout = useCallback(() => {
    authenticationTokenSignal.emit("");
    isAdministratorSignal.emit(false);
  }, []);

  if (authenticated) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" align="center">
          Already authenticated
        </Typography>
        <Typography align="center">
          This page is disabled while you are logged in.
        </Typography>
        <Typography align="center">
          If you wish to access this page, first logout from the application before continuing.
        </Typography>
        <Button variant="outlined" color="error" sx={{ alignSelf: "center" }} onClick={logout}>
          logout
        </Button>
      </Stack>
    );
  }

  return (
    <Outlet />
  );
};