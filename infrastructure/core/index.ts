import { createApplication } from "@renkei/core"
import { listTaskRoute } from "./routes/listTasks";
import { loginRoute } from "./routes/login";
import { createProjectRoute } from "./routes/createProject";
import { listProjectsRoute } from "./routes/listProject";

export const { createServer, createClient } = createApplication({
  routes: {
    listTasks: listTaskRoute,
    login: loginRoute,
    createProject: createProjectRoute,
    listProjects: listProjectsRoute
  }
});