import { PasswordService } from "@todo/application/services/PasswordService";
import bcrypt from "bcryptjs"

export class BcryptPasswordService implements PasswordService {
  public async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  public async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}