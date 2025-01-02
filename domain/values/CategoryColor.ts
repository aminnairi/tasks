import { CategoryColorInvalidHexadecimalFormatError } from "../errors/CategoryColorInvalidHexadecimalFormatError";
import { Value } from "./Value";

export class CategoryColor implements Value<string> {
  private constructor(public readonly value: string) { }

  public static from(value: string) {
    const normalizedValue = value.trim().toLowerCase();

    const categoryColorPattern = /([a-f0-9]){6}/;

    if (!categoryColorPattern.test(normalizedValue)) {
      return new CategoryColorInvalidHexadecimalFormatError();
    }

    return new CategoryColor(normalizedValue);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return value.trim().toLowerCase() === this.value;
  }
}