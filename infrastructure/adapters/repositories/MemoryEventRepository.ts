import { EventLock, EventRepository } from "@todo/application/repositories/EventRepository";
import { FetchFromStreamError } from "@todo/domain/errors/FetchFromStreamError";
import { SaveToStreamFailedError } from "@todo/domain/errors/SaveToStreamFailedError";
import { EventShape } from "@todo/domain/events/EventShape";

export class MemoryEventRepository implements EventRepository {
  private lock: Promise<void> | null = null;

  public constructor(private readonly streams: Record<string, unknown[]> = {}) { }

  public async fetchFromStream(wantedStreamName: string): Promise<FetchFromStreamError | unknown[]> {
    const filteredStreams = Object.entries(this.streams).filter(([streamName]) => {
      return streamName.startsWith(wantedStreamName);
    }).flatMap(([, events]) => {
      return events;
    });

    return filteredStreams;
  }

  public async saveToStream(streamName: string, event: EventShape<unknown, unknown, unknown>): Promise<null | SaveToStreamFailedError> {
    this.streams[streamName] = [
      ...this.streams[streamName] ?? [],
      event
    ]

    return null;
  }

  public createEventLock(): EventLock {
    let unlockFunction: null | (() => void) = null;

    const lock = async () => {
      if (this.lock instanceof Promise) {
        await this.lock;
      }

      this.lock = new Promise(resolve => {
        unlockFunction = resolve;
      });
    };

    const unlock = () => {
      unlockFunction && unlockFunction();
    };

    return {
      lock,
      unlock
    }
  }
}