import { UserEntity } from "../entities/UserEntity";
import { UserEvent } from "../events/users/UserEvent";
import { Aggregate } from "./Aggregate";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserUpdatedEvent } from "../events/users/UserUpdatedEvent";
import { randomUUID } from "crypto";
import { UserCreatedEvent } from "../events/users/UserCreatedEvent";
import { UsernameTooShortError } from "../errors/UsernameTooShortError";
import { PasswordTooShortError } from "../errors/PasswordTooShortError";
import { PasswordDoesNotIncludeLowercaseLetterError } from "../errors/PasswordDoesNotIncludeLowercaseLetterError";
import { PasswordDoesNotIncludeUppercaseLetterError } from "../errors/PasswordDoesNotIncludeUppercaseLetterError";
import { ApplyError } from "../errors/ApplyError";
import { PasswordDoesNotIncludeNumberError } from "../errors/PasswordDoesNotIncludeNumberError";
import { PasswordDoesNotIncludeSymbolError } from "../errors/PasswordDoesNotIncludeSymbolError";

export class UserAggregate implements Aggregate<UserEvent> {
  private constructor(private readonly users: UserEntity[] = []) { }

  public static from(events: UserEvent[] = []) {
    return new UserAggregate().apply(events);
  }

  public apply(events: UserEvent[]) {
    const initialUsers = [] as UserEntity[] | ApplyError<UsernameTooShortError | PasswordTooShortError | PasswordDoesNotIncludeLowercaseLetterError | PasswordDoesNotIncludeUppercaseLetterError | PasswordDoesNotIncludeNumberError | PasswordDoesNotIncludeSymbolError>;

    const users = events.reduce((previousUsers, event) => {
      if (previousUsers instanceof Error) {
        return previousUsers;
      }

      switch (event.type) {
        case "USER_CREATED":
          const newUser = UserEntity.from(
            event.data.identifier,
            event.data.username,
            event.data.password,
            event.data.createdAt,
            event.data.updatedAt,
            event.data.administrator,
          );

          if (newUser instanceof Error) {
            // TODO: apply previous errors as well
            return new ApplyError([newUser]);
          }

          return [
            ...previousUsers,
            newUser
          ];

        case "USER_UPDATED":
          const foundUser = previousUsers.find(user => {
            return user.identifier === event.data.identifier;
          });

          if (!foundUser) {
            return previousUsers;
          }

          const updatedUser = foundUser.apply(event);

          if (updatedUser instanceof Error) {
            // TODO: apply previous errors as well
            return new ApplyError([updatedUser]);
          }

          return [
            ...previousUsers,
            updatedUser
          ]
      }
    }, initialUsers);

    if (users instanceof Error) {
      return users;
    }

    return new UserAggregate(users);
  }

  public findUserByUsername(username: string) {
    const user = this.users.find(user => {
      return user.username.isValue(username);
    });

    if (!user) {
      return new UserNotFoundError()
    }

    return user;
  }

  public createOrUpdateAdministrator(username: string, password: string) {
    const alreadyExistingUser = this.users.find(user => {
      return user.username.isValue(username);
    });

    if (alreadyExistingUser) {
      if (alreadyExistingUser.administrator) {
        return;
      }

      const userUpdatedEvent: UserUpdatedEvent = {
        date: new Date(),
        identifier: randomUUID(),
        type: "USER_UPDATED",
        version: 1,
        data: {
          administrator: true,
          createdAt: null,
          identifier: alreadyExistingUser.identifier,
          password,
          updatedAt: new Date(),
          username: null,
        },
      };

      return userUpdatedEvent;
    }

    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const administrator = true;

    const user = UserEntity.from(
      identifier,
      username,
      password,
      createdAt,
      updatedAt,
      administrator
    );

    if (user instanceof Error) {
      return user;
    }

    const userCreatedEvent: UserCreatedEvent = {
      date: new Date(),
      identifier: randomUUID(),
      type: "USER_CREATED",
      version: 1,
      data: {
        administrator: user.administrator,
        createdAt: user.createdAt,
        identifier: user.identifier,
        password: user.password.value,
        updatedAt: user.updatedAt,
        username: user.username.value
      },
    };

    return userCreatedEvent;
  }
}