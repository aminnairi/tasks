import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { TasksCreatePage } from "./pages/TasksCreatePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProjectsCreatePage } from "./pages/ProjectsCreatePage";

function App() {
  return (
    <Container>
      <AppBar>
        <Toolbar>
          <Typography variant="h4">
            Tasks
          </Typography>
        </Toolbar>
      </AppBar>
      <Box paddingTop="100px">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks/create" element={<TasksCreatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects/create" element={<ProjectsCreatePage />} />
        </Routes>
      </Box>
    </Container>
  );
}

export default App
