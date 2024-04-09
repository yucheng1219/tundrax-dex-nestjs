import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import type { CreateUserDto, UpdateUserDto } from "./dto";
import { UserMapper } from "~/users/user.mapper";
import type { User } from "~/users/domain/user.domain";
import { bcryptHash } from "~/utils/bcrypt";
import { Role } from "~/common/decorators/roles.decorator";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .findOne({ where: { email } })
      .then((u) => (u ? UserMapper.toDomain(u) : null));
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository
      .findOne({ where: { id } })
      .then((u) => (u ? UserMapper.toDomain(u) : null));
  }

  async create(payload: CreateUserDto): Promise<User> {
    const _user = await this.usersRepository.findOne({
      where: { email: payload.email },
    });
    if (_user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "emailAlreadyExists",
        },
      });
    }
    const entity = this.usersRepository.create({
      ...payload,
      role: Role.User,
      password: await bcryptHash(payload.password),
    });
    return this.usersRepository.save(entity).then(UserMapper.toDomain);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const entity = await this.usersRepository.findOne({ where: { id } });
    if (!entity) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    const payload = { ...dto };
    if (payload.password) {
      payload.password = await bcryptHash(payload.password);
    }
    if (payload.email) {
      const _user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });
      if (_user && _user.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailAlreadyExists",
          },
        });
      }
    }
    return this.usersRepository.save({
      ...entity,
      ...payload,
    });
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
