import { ApplyError } from "../errors/ApplyError";
import { CategoryColorInvalidHexadecimalFormatError } from "../errors/CategoryColorInvalidHexadecimalFormatError";
import { CategoryNameTooShortError } from "../errors/CategoryNameTooShortError";
import { CategoryNotFoundError } from "../errors/CategoryNotFoundError";
import { CategoryCreatedEvent } from "../events/categories/CategoryCreatedEvent";
import { CategoryEvent } from "../events/categories/CategoryEvent";
import { CategoryColor } from "../values/CategoryColor";
import { CategoryName } from "../values/CategoryName";
import { Entity } from "./Entity";

export class CategoryEntity implements Entity<CategoryEvent> {
  private constructor(
    public readonly identifier: string,
    public readonly name: CategoryName,
    public readonly color: CategoryColor,
    public readonly projectIdentifier: string,
  ) { }

  public static from(
    identifier: string,
    nameValue: string,
    colorValue: string,
    projectIdentifier: string,
  ) {
    const name = CategoryName.from(nameValue)

    if (name instanceof Error) {
      return name;
    }

    const color = CategoryColor.from(colorValue);

    if (color instanceof Error) {
      return color;
    }

    return new CategoryEntity(
      identifier,
      name,
      color,
      projectIdentifier
    );
  }

  public static fromEvents(events: CategoryEvent[]) {
    const initialCategory = new CategoryNotFoundError() as CategoryNotFoundError | CategoryEntity | ApplyError<CategoryNameTooShortError | CategoryColorInvalidHexadecimalFormatError>;

    const category = events.reduce((_, event) => {
      switch (event.type) {
        case "CATEGORY_CREATED":
          const category = CategoryEntity.from(
            event.data.identifier,
            event.data.name,
            event.data.color,
            event.data.projectIdentifier,
          );

          if (category instanceof Error) {
            return new ApplyError([category]);
          }

          return category;
      }
    }, initialCategory);

    if (category instanceof Error) {
      return category;
    }

    return category;
  }

  public apply(event: CategoryCreatedEvent) {
    switch (event.type) {
      case "CATEGORY_CREATED":
        const category = CategoryEntity.from(
          event.data.identifier,
          event.data.name,
          event.data.color,
          event.data.projectIdentifier
        );

        if (category instanceof Error) {
          return new ApplyError([category]);
        }

        return category;
    }
  }
}