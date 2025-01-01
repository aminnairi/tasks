import { Entity } from "./Entity";

export class CategoryEntity implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: string,
    public readonly color: string,
    public readonly createdAt: Date,
    public readonly updateAt: Date,
    public readonly projectIdentifier: string,
  ) { }
}