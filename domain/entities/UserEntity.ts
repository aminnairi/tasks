import { Entity } from "./Entity";
import { UserEvent } from "../events/users/UserEvent"
import { Username } from "../values/Username";
import { Password } from "../values/Password";
import { UsernameTooShortError } from "../errors/UsernameTooShortError";
import { ApplyError } from "../errors/ApplyError";
import { PasswordDoesNotIncludeLowercaseLetterError } from "../errors/PasswordDoesNotIncludeLowercaseLetterError";
import { PasswordDoesNotIncludeNumberError } from "../errors/PasswordDoesNotIncludeNumberError";
import { PasswordDoesNotIncludeSymbolError } from "../errors/PasswordDoesNotIncludeSymbolError";
import { PasswordDoesNotIncludeUppercaseLetterError } from "../errors/PasswordDoesNotIncludeUppercaseLetterError";
import { PasswordTooShortError } from "../errors/PasswordTooShortError";

export class UserEntity implements Entity<UserEvent> {
  private constructor(
    public readonly identifier: string,
    public readonly username: Username,
    public readonly password: Password,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly administrator: boolean,
  ) { }

  public static from(
    identifier: string,
    usernameValue: string,
    passwordValue: string,
    createdAt: Date,
    updatedAt: Date,
    administrator: boolean,
  ) {
    const username = Username.from(usernameValue);

    if (username instanceof Error) {
      return username;
    }

    const password = Password.from(passwordValue);

    if (password instanceof Error) {
      return password;
    }

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
    // TODO: starts with a not found user error instead
    const initialUser = new ApplyError([]) as UserEntity | ApplyError<UsernameTooShortError | PasswordTooShortError | PasswordDoesNotIncludeNumberError | PasswordDoesNotIncludeLowercaseLetterError | PasswordDoesNotIncludeUppercaseLetterError | PasswordDoesNotIncludeSymbolError>;

    const user = events.reduce((previousUser, event) => {
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

          if (user instanceof Error) {
            // TODO: apply previous errors as well
            return new ApplyError([user]);
          }

          return user;

        case "USER_UPDATED":
          if (previousUser instanceof Error) {
            return previousUser;
          }

          const updatedUser = previousUser.apply(event);

          if (updatedUser instanceof Error) {
            // TODO: apply previous errors as well
            return new ApplyError([updatedUser]);
          }

          return updatedUser;
      }
    }, initialUser);

    return user;
  }

  public apply(event: UserEvent) {
    switch (event.type) {
      case "USER_CREATED":
        return UserEntity.from(
          event.data.identifier,
          event.data.username,
          event.data.password,
          event.data.createdAt,
          event.data.updatedAt,
          event.data.administrator,
        );

      case "USER_UPDATED":
        return UserEntity.from(
          event.data.identifier,
          event.data.username ?? this.username.value,
          event.data.password ?? this.password.value,
          event.data.createdAt ?? this.createdAt,
          event.data.updatedAt ?? this.updatedAt,
          event.data.administrator ?? this.administrator
        )
    }
  }
}