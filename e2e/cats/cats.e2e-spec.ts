import type { INestApplication } from '@nestjs/common'
import { mkTestDataSource } from 'e2e/mk-test-data-source'
import { mkTestModule } from 'e2e/mk-test-module'
import request from 'supertest'
import type { DataSource } from 'typeorm'
import { CatsModule } from '~/cats/cats.module'
import { CatsService } from '~/cats/cats.service'

describe('Cats', () => {
  const catsService = { findAll: () => ['test'] }

  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await mkTestModule([CatsModule])
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
