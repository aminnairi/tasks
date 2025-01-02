import { EventShape } from "../EventShape";

export interface CategoryCreatedEventData {
  readonly identifier: string
  readonly name: string
  readonly color: string
  readonly projectIdentifier: string
}

export interface CategoryCreatedEvent extends EventShape<"CATEGORY_CREATED", 1, CategoryCreatedEventData> { }