import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { FindOptionsWhere } from 'typeorm'
import { Repository } from 'typeorm'
import { SessionMapper } from '~/session/session.mapper'
import type { Session } from './domain/session'
import { SessionEntity } from './session.entity'

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) {}

  async findOne(options: FindOptionsWhere<SessionEntity>): Promise<Session | null> {
    return this.sessionRepository
      .findOne({ where: options })
      .then((entity) => (entity ? SessionMapper.toDomain(entity) : null))
  }

  async create(data: Omit<Session, 'id'>): Promise<Session> {
    const entity = this.sessionRepository.create(data)
    return this.sessionRepository.save(entity).then(SessionMapper.toDomain)
  }

  async update(id: Session['id'], payload: Partial<Omit<Session, 'id'>>): Promise<Session> {
    const entity = await this.sessionRepository.findOne({
      where: { id: Number(id) },
    })

    if (!entity) {
      throw new Error('Session not found')
    }
    return this.sessionRepository.save({ ...entity, ...payload }).then(SessionMapper.toDomain)
  }

  async delete(options: FindOptionsWhere<SessionEntity>) {
    await this.sessionRepository.delete(options)
  }
}
