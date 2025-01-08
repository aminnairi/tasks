import { AuthenticationService } from "@todo/application/services/AuthenticationService";
import { UnauthorizedError } from "@todo/domain/errors/UnauthorizedError";
import jsonwebtoken from "jsonwebtoken";
import { z } from "zod";

export class JsonWebTokenAuthenticationService implements AuthenticationService {
  public constructor(private readonly secret: string) { }

  public async createAuthenticationToken(userIdentifier: string): Promise<string> {
    const payload = {
      userIdentifier
    };

    const authenticationToken = jsonwebtoken.sign(payload, this.secret);

    return authenticationToken;
  }

  public async verifyAuthenticationToken(authenticationToken: string): Promise<string | UnauthorizedError> {
    try {
      const decodedAuthenticationToken = jsonwebtoken.verify(authenticationToken, this.secret);

      const schema = z.object({
        userIdentifier: z.string()
      });

      const payload = schema.parse(decodedAuthenticationToken);

      return payload.userIdentifier;
    } catch {
      return new UnauthorizedError();
    }
  }
}