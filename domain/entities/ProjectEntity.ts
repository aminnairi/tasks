import { randomUUID } from "crypto";
import { ProjectCreatedEvent } from "../events/projects/ProjectCreatedEvent";
import { ProjectEvent } from "../events/projects/ProjectEvent";
import { ProjectName } from "../values/ProjectName";
import { Entity } from "./Entity";
import { UserEntity } from "./UserEntity";
import { ProjectNotFoundError } from "../errors/ProjectNotFoundError";
import { ApplyError } from "../errors/ApplyError";
import { ProjectNameTooShortError } from "../errors/ProjectNameTooShortError";

export class ProjectEntity implements Entity<ProjectEvent> {
  private constructor(
    public readonly identifier: string,
    public readonly name: ProjectName,
    public readonly managerIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }

  public static fromEvents(events: ProjectEvent[]) {
    const initialProject = new ProjectNotFoundError() as ProjectNotFoundError | ProjectEntity | ApplyError<ProjectNameTooShortError>;

    const project = events.reduce((_, event) => {
      switch (event.type) {
        case "PROJECT_CREATED":
          const project = ProjectEntity.from(
            event.data.identifier,
            event.data.name,
            event.data.managerIdentifier,
            event.data.createdAt,
            event.data.updatedAt
          );

          if (project instanceof Error) {
            return new ApplyError([project]);
          }

          return project;
      }
    }, initialProject);

    return project;
  }

  public static from(
    identifier: string,
    nameValue: string,
    managerIdentifier: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = ProjectName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    return new ProjectEntity(
      identifier,
      name,
      managerIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    nameValue: string,
    manager: UserEntity,
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const project = ProjectEntity.from(
      identifier,
      nameValue,
      manager.identifier,
      createdAt,
      updatedAt
    );

    if (project instanceof Error) {
      return project;
    }

    const projectCreatedEvent: ProjectCreatedEvent = {
      date: new Date(),
      identifier: randomUUID(),
      type: "PROJECT_CREATED",
      version: 1,
      data: {
        createdAt: project.createdAt,
        identifier: project.identifier,
        managerIdentifier: project.managerIdentifier,
        name: project.name.value,
        updatedAt: project.updatedAt,
      },
    }

    return projectCreatedEvent;
  }

  public apply(event: ProjectCreatedEvent) {
    switch (event.type) {
      case "PROJECT_CREATED":
        return ProjectEntity.from(
          event.data.identifier,
          event.data.name,
          event.data.managerIdentifier,
          event.data.createdAt,
          event.data.updatedAt
        );
    }
  }
}