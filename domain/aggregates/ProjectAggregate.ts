import { ProjectEntity } from "../entities/ProjectEntity";
import { UserEntity } from "../entities/UserEntity";
import { ApplyError } from "../errors/ApplyError";
import { ProjectNameAlreadyTakenError } from "../errors/ProjectNameAlreadyTakenError";
import { ProjectNameTooShortError } from "../errors/ProjectNameTooShortError";
import { ProjectNotFoundError } from "../errors/ProjectNotFoundError";
import { ProjectEvent } from "../events/projects/ProjectEvent";
import { Aggregate } from "./Aggregate";

export class ProjectAggregate implements Aggregate<ProjectEvent> {
  private constructor(private readonly projects: ProjectEntity[]) { }

  public static fromEvents(events: ProjectEvent[]) {
    return new ProjectAggregate([]).apply(events);
  }

  public apply(events: ProjectEvent[]) {
    const initialProjects = [] as ProjectEntity[] | ApplyError<ProjectNameTooShortError>;

    const projects = events.reduce((previousProjects, event) => {
      switch (event.type) {
        case "PROJECT_CREATED":
          const newProject = ProjectEntity.from(
            event.data.identifier,
            event.data.name,
            event.data.managerIdentifier,
            event.data.createdAt,
            event.data.updatedAt
          );

          if (newProject instanceof Error) {
            return new ApplyError([newProject]);
          }

          if (previousProjects instanceof Error) {
            return previousProjects;
          }

          return [
            ...previousProjects,
            newProject
          ]
      }
    }, initialProjects);

    if (projects instanceof Error) {
      return projects;
    }

    return new ProjectAggregate(projects);
  }

  public createProject(
    nameValue: string,
    manager: UserEntity,
  ) {
    const existingManagerProjects = this.projects.filter(project => {
      return project.managerIdentifier === manager.identifier;
    });

    const projectWithSimilarName = existingManagerProjects.find(project => {
      return project.name.isValue(nameValue);
    });

    if (projectWithSimilarName) {
      return new ProjectNameAlreadyTakenError();
    }

    return ProjectEntity.create(
      nameValue,
      manager
    );
  }

  public getAllProjectsForManager(managerIdentifier: string) {
    return this.projects.filter(project => {
      return managerIdentifier === project.managerIdentifier;
    });
  }

  public getProjectFromManager(managerIdentifier: string, projectIdentifier: string) {
    const managerProjects = this.projects.filter(project => {
      return project.managerIdentifier === managerIdentifier;
    });

    const project = managerProjects.find(project => {
      return project.identifier === projectIdentifier;
    });

    if (!project) {
      return new ProjectNotFoundError();
    }

    return project;
  }
}