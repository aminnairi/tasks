import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { client } from "../renkei";
import { CancelError } from "@renkei/core";
import { exhaustive } from "exhaustive";
import { ProjectsResponse } from "@todo/application/responses/ProjectsResponse";
import { useSignal } from "@aminnairi/react-signal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";

export const ProjectsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectsResponse>([]);
  const authenticationToken = useSignal(authenticationTokenSignal);

  useEffect(() => {
    setError("");
    setLoading(true);

    client.listProjects({
      input: {
        authenticationToken
      }
    }).then(response => {
      if (response instanceof Error) {
        if (response instanceof CancelError) {
          setError("Request has been canceled.");
          return;
        }

        setError("An unexpected error occurred, please try again later.");
        return;
      }

      if (response.success) {
        setProjects(response.projects);
        return;
      }

      exhaustive(response.error, {
        DATABASE_CORRUPTED: () => {
          setError("Database corruption, please contact an administrator.");
        },
        STREAM_FETCH_ERROR: () => {
          setError("Failed to fetch the list of projects, please try again later or contact an administrator.");
        },
        UNEXPECTED_ERROR: () => {
          setError("An unexpected error occurred, please try again later or contact an administrator.");
        },
        UNAUTHORIZED: () => {
          setError("Please, signin first before listing your projects.");
        }
      });
    }).catch(error => {
      console.error(error);
      setError("An unexpected error occurred, please try again later");
    }).finally(() => {
      setLoading(false);
    });
  }, [authenticationToken]);

  return (
    <Stack spacing={3}>
      <Typography align="center" variant="h4">
        Projects
      </Typography>
      {loading ? (
        <Alert severity="info">
          Fetching your projects, please wait...
        </Alert>
      ) : error ? (
        <Alert severity="error">
          {error}
        </Alert>
      ) : projects.length === 0 ? (
        <Typography align="center">
          No projects to display yet.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Identifier
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Created At
                </TableCell>
                <TableCell>
                  Updated At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map(project => (
                <TableRow key={project.identifier}>
                  <TableCell>
                    {project.identifier}
                  </TableCell>
                  <TableCell>
                    {project.name}
                  </TableCell>
                  <TableCell>
                    {project.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {project.updatedAt.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}