import { TaskDescriptionTooShortError } from "../errors/TaskDescriptionTooShortError";
import { Value } from "./Value";

export class TaskDescription implements Value<string> {
  private constructor(public readonly value: string) { }

  public static from(value: string) {
    const normalizedValue = value.trim();

    if (normalizedValue.length < 3) {
      return new TaskDescriptionTooShortError
    }

    return new TaskDescription(normalizedValue);
  }

  public is(item: Value<string>): boolean {
    return this.value.toLowerCase() === item.value.toLowerCase();
  }

  public isValue(value: string): boolean {
    return this.value === value.trim().toLowerCase();
  }
}