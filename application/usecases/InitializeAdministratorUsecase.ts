import { UserAggregate } from "@todo/domain/aggregates/UserAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { PasswordService } from "../services/PasswordService";

export class InitializeAdministratorUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly passwordService: PasswordService,
  ) { }

  public async execute(username: string, password: string) {
    const unparsedUserEvents = await this.eventRepository.fetchFromStream("user-");

    if (unparsedUserEvents instanceof Error) {
      return unparsedUserEvents;
    }

    const userEvents = this.eventParserService.parseUserEvents(unparsedUserEvents);

    if (userEvents instanceof Error) {
      return userEvents;
    }

    const userAggregate = UserAggregate.from(userEvents);
    const hashedPassword = await this.passwordService.hashPassword(password);

    const userCreatedOrUpdatedEvent = userAggregate.createOrUpdateAdministrator(username, hashedPassword);

    if (!userCreatedOrUpdatedEvent) {
      return false;
    }

    const result = await this.eventRepository.saveToStream(`user-${userCreatedOrUpdatedEvent.data.identifier}`, userCreatedOrUpdatedEvent);

    if (result instanceof Error) {
      return result;
    }

    return true;
  }
}