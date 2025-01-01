import { JsonWebTokenAuthenticationService } from "@todo/adapters/services/JsonWebTokenAuthenticationService";
import { settings } from "../settings";

export const authenticationService = new JsonWebTokenAuthenticationService(settings.jsonWebToken.secret);