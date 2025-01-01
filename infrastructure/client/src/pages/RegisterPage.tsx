import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const RegisterPage = () => {
  return (
    <Stack spacing={3}>
      <Stack component="form" spacing={3}>
        <TextField label="email" />
        <Button variant="contained" sx={{ alignSelf: "center" }}>
          Register
        </Button>
      </Stack>
    </Stack>
  );
}