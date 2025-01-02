import { UserEntity } from "../entities/UserEntity";
import { UserEvent } from "../events/users/UserEvent";
import { Aggregate } from "./Aggregate";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserUpdatedEvent } from "../events/users/UserUpdatedEvent";
import { randomUUID } from "crypto";
import { UserCreatedEvent } from "../events/users/UserCreatedEvent";

export class UserAggregate implements Aggregate<UserEvent> {
  private constructor(private readonly users: UserEntity[] = []) { }

  public static from(events: UserEvent[] = []) {
    return new UserAggregate().apply(events);
  }

  public apply(events: UserEvent[]) {
    const initialUsers: UserEntity[] = [];

    const users = events.reduce((users, event) => {
      switch (event.type) {
        case "USER_CREATED":
          const user = UserEntity.from(
            event.data.identifier,
            event.data.username,
            event.data.password,
            event.data.createdAt,
            event.data.updatedAt,
            event.data.administrator,
          );

          return [
            ...users,
            user
          ];

        case "USER_UPDATED":
          return users.map(user => {
            if (user.identifier !== event.data.identifier) {
              return user;
            }

            return user.update(event.data);
          });
      }
    }, initialUsers);

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