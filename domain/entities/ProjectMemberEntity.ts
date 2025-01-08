import { ProjectMemberCreatedEvent } from "../events/projectMembers/ProjectMemberCreatedEvent";
import { ProjectMemberEvent } from "../events/projectMembers/ProjectMemberEvent";
import { Entity } from "./Entity";

export class ProjectMemberEntity implements Entity<ProjectMemberEvent> {
  private constructor(
    public readonly identifier: string,
    public readonly projectIdentifier: string,
    public readonly userIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }

  public apply(event: ProjectMemberCreatedEvent) {
    switch (event.type) {
      case "PROJECT_MEMBER_CREATED":
        return new ProjectMemberEntity(
          event.data.identifier,
          event.data.projectIdentifier,
          event.data.userIdentifier,
          event.data.createdAt,
          event.data.updatedAt,
        );
    }
  }
}