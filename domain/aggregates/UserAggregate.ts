import { UserEntity } from "../entities/UserEntity";
import { UserEvent } from "../events/users/UserEvent";
import { Aggregate } from "./Aggregate";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";
import { UserUpdatedEvent } from "../events/users/UserUpdatedEvent";
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
      return user.username === username;
    });

    if (!user) {
      return new UserNotFoundError
    }

    return user;
  }

    });
  }
}