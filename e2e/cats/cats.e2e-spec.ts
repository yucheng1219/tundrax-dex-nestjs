import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { mkTestModule } from 'e2e/mk-test-module'
import { e2eLogin } from 'e2e/util'
import request from 'supertest'
import type { CatEntity } from '~/cats/cat.entity'
import { CatsModule } from '~/cats/cats.module'
import { CatsService } from '~/cats/cats.service'
import type { CreateCatDto } from '~/cats/dto'
import {
  UserSeedService,
  adminSeedUser,
  normalSeedUser,
} from '~/database/seeds/user/user-seed.service'

const mkMockCat = (id: number, dto: CreateCatDto): CatEntity => {
  return { ...dto, id }
}
const mockCat1 = mkMockCat(1, { name: 'Cat1', age: 2, breed: 'breed' })

describe('Cats', () => {
  const catsService = {
    findAll: () => ['test'],
    create: () => mockCat1,
    deleteOne: () => null,
    update: () => mockCat1,
    findOne: () => mockCat1,
  }

  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await mkTestModule([CatsModule])
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    const seedService = app.get(UserSeedService)
    await app.init()
    // seed users
    await seedService.run()
  })

  it(`/GET cats return unauthorized`, () => {
    return request(app.getHttpServer()).get('/cats').expect(401)
  })

  it(`/GET cats when logged in`, async () => {
    const { token } = await e2eLogin(app, normalSeedUser)
    return request(app.getHttpServer())
      .get('/cats')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect({
        data: catsService.findAll(),
      })
  })

  it(`/GET cats/{:id} when logged in`, async () => {
    const { token } = await e2eLogin(app, normalSeedUser)
    return request(app.getHttpServer())
      .get(`/cats/${mockCat1.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect({
        data: mockCat1,
      })
  })

  it(`/POST cats return forbidden when non-admin user`, async () => {
    const { token } = await e2eLogin(app, normalSeedUser)
    const { id: _id, ...dto } = mockCat1
    return request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .auth(token, { type: 'bearer' })
      .expect(403)
  })

  it(`/POST cats for admin user`, async () => {
    const { token } = await e2eLogin(app, adminSeedUser)
    const { id: _id, ...dto } = mockCat1
    return request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .auth(token, { type: 'bearer' })
      .expect(201)
      .expect({
        data: mockCat1,
      })
  })

  test.each([
    // invalid age (not numeric)
    {
      name: 'catname',
      age: '3',
      breed: 'breed',
    },
    //name missing
    {
      age: 3,
      breed: 'breed',
    },
    //breed missing
    {
      name: 'catname',
      age: 3,
    },
  ])('/POST cats invalid input', async (data) => {
    const { token } = await e2eLogin(app, adminSeedUser)
    return await request(app.getHttpServer())
      .post('/cats')
      .auth(token, { type: 'bearer' })
      .send(data)
      .expect(400)
  })

  it(`/DELETE cats/{:id} return forbidden when non-admin user`, async () => {
    const { token } = await e2eLogin(app, normalSeedUser)
    return request(app.getHttpServer())
      .delete(`/cats/${mockCat1.id}`)
      .auth(token, { type: 'bearer' })
      .expect(403)
  })

  it(`/DELETE cats/{:id} cats return forbidden admin user`, async () => {
    const { token } = await e2eLogin(app, adminSeedUser)
    return request(app.getHttpServer())
      .delete(`/cats/${mockCat1.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })

  it(`/PUT cats/{:id} return forbidden non-admin user`, async () => {
    const { token } = await e2eLogin(app, normalSeedUser)
    const { id: _id, ...dto } = mockCat1
    return request(app.getHttpServer())
      .put(`/cats/${mockCat1.id}`)
      .send(dto)
      .auth(token, { type: 'bearer' })
      .expect(403)
  })

  it(`/PUT cats/{:id} return forbidden admin user`, async () => {
    const { token } = await e2eLogin(app, adminSeedUser)
    const { id: _id, ...dto } = mockCat1
    return request(app.getHttpServer())
      .put(`/cats/${mockCat1.id}`)
      .send(dto)
      .auth(token, { type: 'bearer' })
      .expect(200)
  })

  afterAll(async () => {
    await app.close()
  })
})
