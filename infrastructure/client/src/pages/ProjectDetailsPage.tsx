import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { useEffect, useMemo, useState } from "react";
import { client } from "../renkei";
import { useSignal } from "@aminnairi/react-signal";
import { authenticationTokenSignal } from "../signals/authenticationTokenSignal";
import { useParams } from "react-router";
import { CancelError } from "@renkei/core";
import { exhaustive } from "exhaustive";
import { ProjectResponse } from "@todo/application/responses/ProjectsResponse";

export interface ProjectLoading {
  status: "loading"
}

export interface ProjectLoaded {
  status: "loaded",
  project: ProjectResponse
}

export interface ProjectError {
  status: "error",
  error: string
}

export type Project =
  | ProjectLoading
  | ProjectError
  | ProjectLoaded

export const ProjectDetailsPage = () => {
  const [state, setState] = useState<Project>({
    status: "loading"
  });

  const authenticationToken = useSignal(authenticationTokenSignal);
  const params = useParams();
  const projectIdentifier = useMemo(() => params["project"] ?? "", [params]);

  useEffect(() => {
    setState({
      status: "loading"
    });

    client.getProjectDetails({
      input: {
        authenticationToken,
        projectIdentifier
      }
    }).then(response => {
      if (response instanceof Error) {
        if (response instanceof CancelError) {
          setState({
            status: "error",
            error: "The request has been canceled",
          });

          return;
        }

        setState({
          status: "error",
          error: "An unexpected error occurred, please try again later",
        });

        return;
      }

      if (response.success) {
        setState({
          status: "loaded",
          project: response.project
        });

        return;
      }

      setState({
        status: "error",
        error: exhaustive(response.error, {
          CORRUPTED_DATABASE: () => {
            return "Database corrupted, please try again or contact an administrator"
          },
          PROJECT_NOT_FOUND: () => {
            return "Project not found, or recently deleted";
          },
          STREAM_FETCH_ERROR: () => {
            return "Failed to fetch the project, please try again later";
          },
          UNAUTHORIZED: () => {
            return "You must be authenticated before displaying the details of this project";
          },
          UNEXPECTED_ERROR: () => {
            return "An unexpected error occurred, please try again later"
          }
        })
      });

    }).catch(error => {
      console.error(error);

      setState({
        status: "error",
        error: "An unexpected error occurred, please try again later",
      });
    });
  }, [authenticationToken, projectIdentifier]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" align="center">
        Project Details
      </Typography>
      {state.status === "loading" ? (
        <Alert severity="info">
          Your project's details are loading, please wait...
        </Alert>
      ) : state.status === "error" ? (
        <Alert severity="error">
          {state.error}
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">
                  Identifier
                </TableCell>
                <TableCell>
                  {state.project.identifier}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">
                  Name
                </TableCell>
                <TableCell>
                  {state.project.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">
                  Created At
                </TableCell>
                <TableCell>
                  {state.project.createdAt.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">
                  Updated At
                </TableCell>
                <TableCell>
                  {state.project.updatedAt.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}