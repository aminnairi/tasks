export interface ProjectResponse {
  identifier: string,
  name: string,
  createdAt: Date,
  updatedAt: Date,
}

export type ProjectsResponse = Array<ProjectResponse>;