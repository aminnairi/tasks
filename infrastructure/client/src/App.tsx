import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { TasksCreatePage } from "./pages/TasksCreatePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProjectsCreatePage } from "./pages/ProjectsCreatePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { Header } from "./components/Header";

function App() {
  return (
    <Container>
      <Header />
      <Box paddingTop="100px">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks/create" element={<TasksCreatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/create" element={<ProjectsCreatePage />} />
        </Routes>
      </Box>
    </Container>
  );
}

export default App
