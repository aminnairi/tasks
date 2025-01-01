import { Entity } from "./Entity";
import { UserEvent } from "../events/users/UserEvent"
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { UserUpdatedEventData } from "../events/users/UserUpdatedEvent";

export class UserEntity implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly username: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly administrator: boolean,
  ) { }

  public static from(
    identifier: string,
    username: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    administrator: boolean,
  ) {
    return new UserEntity(
      identifier,
      username,
      password,
      createdAt,
      updatedAt,
      administrator,
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
            event.data.username,
            event.data.password,
            event.data.createdAt,
            event.data.updatedAt,
            event.data.administrator,
          )
        case "USER_UPDATED":
          if (previousUser === null) {
            return previousUser;
          }

          return previousUser.update(event.data);
      }
    }, null as null | UserEntity);

    if (!user) {
      return new UserNotFoundError;
    }

    return user;
  }

  public update(properties: UserUpdatedEventData) {
    return UserEntity.from(
      properties.identifier,
      properties.username ?? this.username,
      properties.password ?? this.password,
      properties.createdAt ?? this.createdAt,
      properties.updatedAt ?? this.updatedAt,
      properties.administrator ?? this.administrator
    )
  }
}