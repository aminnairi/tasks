import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export const NotFoundPage = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" align="center">
        Page Not Found
      </Typography>
      <Typography align="center">
        This page is either not found or has been recently deleted.
      </Typography>
    </Stack>
  );
};