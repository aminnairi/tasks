import { UserEntity } from "../entities/UserEntity";
import { UserEvent } from "../events/users/UserEvent";
import { Aggregate } from "./Aggregate";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";
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
      }
    }, initialUsers);

    return new UserAggregate(users);
  }

  public register(newUser: UserEntity) {
    const alreadyRegisteredUser = this.users.find(user => {
      return user.identifier === newUser.identifier;
    });

    if (alreadyRegisteredUser) {
      return new UserAlreadyExistsError;
    }

    return new UserCreatedEvent({
      createdAt: newUser.createdAt,
      email: newUser.email,
      firstname: newUser.firstname,
      identifier: newUser.identifier,
      lastname: newUser.lastname,
      updatedAt: newUser.updatedAt
    });
  }
}