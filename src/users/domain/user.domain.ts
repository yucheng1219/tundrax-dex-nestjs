import { Exclude } from "class-transformer";
import type { Role } from "~/common/decorators/roles.decorator";

export class User {
  id: number;
  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  fullName: string;

  role: Role;
}
