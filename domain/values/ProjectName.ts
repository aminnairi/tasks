import { ProjectNameTooShortError } from "../errors/ProjectNameTooShortError";
import { Value } from "./Value";

export class ProjectName implements Value<string> {
  private constructor(public readonly value: string) { }

  public static from(value: string) {
    const normalizedValue = value.trim();

    if (normalizedValue.length < 3) {
      return new ProjectNameTooShortError();
    }

    return new ProjectName(value);
  }

  public is(item: Value<string>): boolean {
    return item.value.toLowerCase() === this.value.toLowerCase();
  }

  public isValue(value: string): boolean {
    return value.trim().toLowerCase() === this.value.toLowerCase();
  }
}