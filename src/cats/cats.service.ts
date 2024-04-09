import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CatEntity } from "~/cats/cat.entity";
import { Repository } from "typeorm";
import type { CreateCatDto, UpdateCatDto } from "./dto";
import type { Cat } from "~/cats/domain/cat.domain";
import { CatMapper } from "~/cats/cat.mapper";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity) private catsRepository: Repository<CatEntity>
  ) {}

  async findOne(id: number): Promise<Cat | null> {
    return this.catsRepository
      .findOne({ where: { id } })
      .then((c) => (c ? CatMapper.toDomain(c) : null));
  }

  async create(cat: CreateCatDto): Promise<Cat> {
    const entity = this.catsRepository.create({
      ...cat,
    });
    return this.catsRepository.save(entity).then(CatMapper.toDomain);
  }

  async update(id: number, update: UpdateCatDto): Promise<Cat> {
    const entity = await this.catsRepository.findOne({ where: { id } });
    if (!entity) {
      throw new HttpException("Cat not found", HttpStatus.NOT_FOUND);
    }
    return this.catsRepository
      .save({
        ...entity,
        ...update,
      })
      .then(CatMapper.toDomain);
  }

  async findAll(): Promise<CatEntity[]> {
    return this.catsRepository
      .find()
      .then((cats) => cats.map(CatMapper.toDomain));
  }

  async deleteOne(id: number): Promise<void> {
    const result = await this.catsRepository.delete(id);
    if (result.affected !== 1) {
      throw new HttpException("Cat not found", HttpStatus.NOT_FOUND);
    }
  }
}
