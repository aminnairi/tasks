import { FetchFromStreamError } from "../../domain/errors/FetchFromStreamError";
import { SaveToStreamFailedError } from "../../domain/errors/SaveToStreamFailedError";
import { EventShape } from "../../domain/events/EventShape";

export interface EventLock {
  readonly lock: () => Promise<void>
  readonly unlock: () => void;
}

export type ReleaseLockFunction = () => void;

export interface EventRepository {
  readonly fetchFromStream: (streamName: string) => Promise<FetchFromStreamError | unknown[]>
  readonly saveToStream: (streamName: string, event: EventShape<unknown>) => Promise<null | SaveToStreamFailedError>
  readonly createEventLock: () => EventLock
}