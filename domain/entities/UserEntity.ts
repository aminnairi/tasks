import { Entity } from "./Entity";
import { UserEvent } from "../events/users/UserEvent"
import { UserNotFoundError } from "../errors/UserNotFoundError";

export class UserEntity implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  public static from(
    identifier: string,
    email: string,
    firstname: string,
    lastname: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    return new UserEntity(
      identifier,
      email,
      firstname,
      lastname,
      createdAt,
      updatedAt
    );
  }

  public static fromEvents(events: UserEvent[]) {
    const user = events.reduce((previousUser, event) => {
      if (!previousUser) {
        return previousUser;
      }

      switch (event.type) {
        case "USER_CREATED":
          return UserEntity.from(
            event.data.identifier,
            event.data.email,
            event.data.firstname,
            event.data.lastname,
            event.data.createdAt,
            event.data.updatedAt
          )
      }
    }, null as null | UserEntity);

    if (!user) {
      return new UserNotFoundError;
    }

    return user;
  }
}