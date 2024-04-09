import { CatEntity } from '~/cats/cat.entity'
import { Cat } from '~/cats/domain/cat.domain'

export class CatMapper {
  static toDomain(raw: CatEntity): Cat {
    const cat = new Cat()
    cat.id = raw.id
    cat.name = raw.name
    cat.age = raw.age
    cat.breed = raw.breed
    return cat
  }

  static toPersistence(cat: Cat): CatEntity {
    const entity = new CatEntity()
    entity.id = cat.id
    entity.name = cat.name
    entity.age = cat.age
    entity.breed = cat.breed
    return entity
  }
}
