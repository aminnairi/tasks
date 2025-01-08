import { UnauthorizedError } from "@todo/domain/errors/UnauthorizedError"

export interface AuthenticationService {
  readonly createAuthenticationToken: (userIdentifier: string) => Promise<string>
  readonly verifyAuthenticationToken: (authenticationToken: string) => Promise<string | UnauthorizedError>
}