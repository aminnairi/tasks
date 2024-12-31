import { randomUUID } from "crypto";
import { UserAggregate } from "../../domain/aggregates/UserAggregate";
import { UserEntity } from "../../domain/entities/UserEntity";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { UnexpectedError } from "../../domain/errors/UnexpectedError";

export class RegisterUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
  ) { }

  public async execute(email: string, firstname: string, lastname: string) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      await eventLock.lock();

      const unparsedEvents = await this.eventRepository.fetchFromStream(`user-`);

      if (unparsedEvents instanceof Error) {
        return unparsedEvents;
      }

      const events = this.eventParserService.parseUserEvents(unparsedEvents);
      const userAggregate = UserAggregate.from(events);
      const createdAt = new Date();
      const updatedAt = new Date();
      const identifier = randomUUID() as string;

      const user = UserEntity.from(
        identifier,
        email,
        firstname,
        lastname,
        createdAt,
        updatedAt
      )

      const userCreatedEvent = userAggregate.register(user);

      if (userCreatedEvent instanceof Error) {
        return userCreatedEvent;
      }

      const result = await this.eventRepository.saveToStream(`user-${user.identifier}`, userCreatedEvent);

      if (result instanceof Error) {
        return result;
      }

      return null;
    } catch (error) {
      return error instanceof Error ? new UnexpectedError(error.message) : new UnexpectedError(error);
    } finally {
      eventLock.unlock();
    }
  }
}