import { EventShape } from "../events/EventShape";

export interface Aggregate<Event extends EventShape<unknown>> {
  readonly apply: (events: Event[]) => Aggregate<Event> | Error
}