import { EventShape } from "../events/EventShape";

export interface Entity<Event extends EventShape<unknown, unknown, unknown>> {
  readonly identifier: string;
  readonly apply: (event: Event) => Entity<Event> | Error
}