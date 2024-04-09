import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { Role } from "~/common/decorators/roles.decorator";
import { UserEntity } from "~/users/user.entity";
import { bcryptHash } from "~/utils/bcrypt";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: Role.Admin,
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("admin-secret", salt);

      await this.repository.save(
        this.repository.create({
          fullName: "SuperAdmin",
          email: "admin@example.com",
          password,
          role: Role.Admin,
        })
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: Role.User,
      },
    });

    if (!countUser) {
      const password = await bcryptHash("secret");
      await this.repository.save(
        this.repository.create({
          fullName: "John Doe",
          email: "john.doe@example.com",
          password,
          role: Role.User,
        })
      );
    }
  }
}
