import { UsernameTooShortError } from "../errors/UsernameTooShortError";
import { Value } from "./Value";

export class Username implements Value<string> {
  private constructor(
    public readonly value: string,
  ) { }

  public static from(value: string) {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.length < 3) {
      return new UsernameTooShortError();
    }

    return new Username(normalizedValue);
  }

  public is(item: Value<string>): boolean {
    return item.value === this.value;
  }

  public isValue(value: string): boolean {
    return value.trim().toLowerCase() === this.value;
  }
}