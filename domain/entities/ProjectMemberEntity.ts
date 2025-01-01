import { Entity } from "./Entity";

export class ProjectMemberEntity implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly projectIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }
}