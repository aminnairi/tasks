import { EventShape } from "../EventShape";

export interface ProjectMemberCreatedEventData {
  identifier: string,
  userIdentifier: string,
  projectIdentifier: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface ProjectMemberCreatedEvent extends EventShape<"PROJECT_MEMBER_CREATED", 1, ProjectMemberCreatedEventData> { }