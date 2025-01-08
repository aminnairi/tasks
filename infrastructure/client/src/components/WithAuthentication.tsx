import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Outlet, Link as RouterLink } from "react-router";
import { useSignal } from "@aminnairi/react-signal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";
import { useMemo } from "react";

export const WithAuthentication = () => {
  const authenticationToken = useSignal(authenticationTokenSignal);
  const authenticated = useMemo(() => !!authenticationToken, [authenticationToken]);

  if (!authenticated) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" align="center">
          Unauthorized
        </Typography>
        <Typography align="center">
          Authentication is required before accessing this page.
        </Typography>
        <Typography align="center">
          You can go to the <Link component={RouterLink} to="/login">login</Link> page and use your credentials to display this page.
        </Typography>
      </Stack>
    );
  }

  return (
    <Outlet />
  );
}