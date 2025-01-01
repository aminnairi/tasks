import { Entity } from "./Entity";

export class ProjectEntity implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: string,
    public readonly managerIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }
}