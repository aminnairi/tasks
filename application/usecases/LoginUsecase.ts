import { UserAggregate } from "@todo/domain/aggregates/UserAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { UnexpectedError } from "@todo/domain/errors/UnexpectedError";
import { PasswordService } from "../services/PasswordService";
import { UserNotFoundError } from "@todo/domain/errors/UserNotFoundError";
import { AuthenticationService } from "../services/AuthenticationService";
import { LoginResponse } from "../responses/LoginResponse";

export class LoginUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly passwordService: PasswordService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(
    username: string,
    password: string
  ) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      const unparsedUserEvents = await this.eventRepository.fetchFromStream("user-");

      if (unparsedUserEvents instanceof Error) {
        return unparsedUserEvents;
      }

      const userEvents = this.eventParserService.parseUserEvents(unparsedUserEvents);

      if (userEvents instanceof Error) {
        return userEvents;
      }

      const userAggregate = UserAggregate.from(userEvents);

      if (userAggregate instanceof Error) {
        return userAggregate;
      }

      const user = userAggregate.findUserByUsername(username);

      if (user instanceof Error) {
        return user;
      }

      const passwordValid = await this.passwordService.verifyPassword(password, user.password.value);

      if (!passwordValid) {
        return new UserNotFoundError;
      }

      const authenticationToken = await this.authenticationService.createAuthenticationToken(user.identifier);

      const response: LoginResponse = {
        authenticationToken,
        administrator: user.administrator
      }

      return response;
    } catch (error) {
      return new UnexpectedError(error instanceof Error ? error.message : String(error));
    } finally {
      eventLock.unlock();
    }
  }
}