import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ChangeEvent, useCallback, useState } from "react";

export const TasksCreatePage = () => {
  const [description, setDescription] = useState("");

  const onDescriptionChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={3}>
        <TextField label="Description" value={description} onChange={onDescriptionChange} />
        <Button variant="contained" sx={{ alignSelf: "center" }}>
          Create
        </Button>
      </Stack>
    </Stack>
  );
};