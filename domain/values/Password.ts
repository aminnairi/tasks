import { PasswordDoesNotIncludeLowercaseLetterError } from "../errors/PasswordDoesNotIncludeLowercaseLetterError";
import { PasswordDoesNotIncludeNumberError } from "../errors/PasswordDoesNotIncludeNumberError";
import { PasswordDoesNotIncludeSymbolError } from "../errors/PasswordDoesNotIncludeSymbolError";
import { PasswordDoesNotIncludeUppercaseLetterError } from "../errors/PasswordDoesNotIncludeUppercaseLetterError";
import { PasswordTooShortError } from "../errors/PasswordTooShortError";
import { Value } from "./Value";

export class Password implements Value<string> {
  private constructor(public readonly value: string) { }

  public static from(value: string) {
    if (value.length < 8) {
      return new PasswordTooShortError();
    }

    if (!/(?=\d)/.test(value)) {
      return new PasswordDoesNotIncludeNumberError();
    }

    if (!/(?=[a-z])/.test(value)) {
      return new PasswordDoesNotIncludeLowercaseLetterError();
    }

    if (!/(?=[A-Z])/.test(value)) {
      return new PasswordDoesNotIncludeUppercaseLetterError();
    }

    if (!/(?=[^a-zA-Z0-9])/.test(value)) {
      return new PasswordDoesNotIncludeSymbolError();
    }

    return new Password(value);
  }

  public is(item: Value<string>): boolean {
    return item.value === this.value;
  }

  public isValue(value: string): boolean {
    return value === this.value;
  }
}