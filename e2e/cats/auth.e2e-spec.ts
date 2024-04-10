import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { mkTestModule } from 'e2e/mk-test-module'
import { e2eLogin } from 'e2e/util'
import request from 'supertest'
import type { JwtPayload, JwtRefreshPayload } from '~/auth/strategy/types'
import type { LoginResponseType } from '~/auth/types'
import { Role } from '~/common/decorators/roles.decorator'
import { ValidationPipe } from '~/common/pipes/validation.pipe'
import type { AllConfigType } from '~/config/config.type'
import {
  UserSeedService,
  adminSeedUser,
  normalSeedUser,
} from '~/database/seeds/user/user-seed.service'
import type { User } from '~/users/domain/user.domain'

describe('auth', () => {
  let app: INestApplication
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await mkTestModule([]).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    const seedService = app.get(UserSeedService)

    await app.init()

    const configService: ConfigService<AllConfigType> = app.get(ConfigService)
    jwtService = new JwtService({
      secret: configService.get('auth.secret', { infer: true }),
    })
    // seed users
    await seedService.run()
  })

  test.each([normalSeedUser, adminSeedUser])('/POST auth/login should work', async (user) => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200)
      .expect((res) => {
        const { token, user, refreshToken } = res.body.data as LoginResponseType
        expect(user.email).toBe(user.email)
        expect(user.role).toBe(user.role)
        expect(user.fullName).toBe(user.fullName)

        // parse jwt
        const payload: JwtPayload = jwtService.decode(token)
        expect(payload.sub).toBe(user.email)
        expect(payload.role).toBe(user.role)

        // parse refresh JWT and compare if sessionId matches JWT
        const refreshPayload: JwtRefreshPayload = jwtService.decode(refreshToken)
        expect(refreshPayload.sessionId).toBe(payload.sessionId)
      })
  })

  test.each([
    {
      email: 'nonexist@email.com',
      password: 'somepassword',
    },
    {
      email: normalSeedUser.email,
      password: `${normalSeedUser.password}+randomstring`,
    },
  ])('/POST auth/login should return unauthorized', async (data) => {
    await request(app.getHttpServer()).post('/auth/login').send(data).expect(401)
  })

  test.each([
    // invalid email
    {
      email: 'invalidemail',
      password: '12345678',
    },
    // invalid password (min len)
    {
      email: 'valid@email.com',
      password: '123',
    },
    // no password
    {
      email: 'valid@email.com',
    },
  ] as const)('/POST auth/login invalid input', async (data) => {
    request(app.getHttpServer()).post('/auth/register').send(data).expect(400)
  })

  it('/POST auth/register should work', async () => {
    const createuserDTO = {
      email: 'newuser@test.com',
      password: 'password',
      fullName: 'New Test User',
    }
    await request(app.getHttpServer()).post('/auth/register').send(createuserDTO).expect(201)

    // try to login
    const { token, user } = await e2eLogin(app, createuserDTO)
    expect(token).toBeDefined()
    expect(user.role).toBe(Role.User)
  })

  it('/POST auth/register should not work with duplicated email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: normalSeedUser.email,
        fullName: 'fullName',
        password: 'random',
      })
      .expect(422)
      .expect({ status: 422, errors: { email: 'emailAlreadyExists' } })
  })

  it('/GET me should work', async () => {
    const { token } = await e2eLogin(app, normalSeedUser)
    await request(app.getHttpServer())
      .get('/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        const result: User = res.body.data
        expect(result.email).toBe(normalSeedUser.email)
        expect(result.fullName).toBe(normalSeedUser.fullName)
        expect(result.role).toBe(normalSeedUser.role)
      })
  })

  it('/GET me should return unauthorized', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401)
  })

  test.each([
    // invalid email
    {
      email: 'invalidemail',
      fullName: 'First Name',
      password: '12345678',
    },
    // fullName missing
    {
      email: 'valid@email.com',
      password: '12345678',
    },
    // invalid password (min len)
    {
      email: 'valid@email.com',
      fullName: 'First Name',
      password: '123',
    },
    // no password
    {
      email: 'valid@email.com',
      fullName: 'First Name',
    },
  ] as const)('/POST auth/register invalid input', async (data) => {
    request(app.getHttpServer()).post('/auth/register').send(data).expect(422)
  })

  test.each([
    // invalid email
    {
      email: 'invalidemail',
      fullName: 'First Name',
      password: '12345678',
    },
    // fullName missing
    {
      email: 'valid@email.com',
      password: '12345678',
    },
    // invalid password (min len)
    {
      email: 'valid@email.com',
      fullName: 'First Name',
      password: '123',
    },
    // no password
    {
      email: 'valid@email.com',
      fullName: 'First Name',
    },
  ] as const)('/POST auth/register invalid input', async (data) => {
    request(app.getHttpServer()).post('/auth/register').send(data).expect(400)
  })

  afterAll(async () => {
    await app.close()
  })
})
