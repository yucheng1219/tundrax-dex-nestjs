import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import type { LoginResponseType } from '~/auth/types'
import type { User } from '~/users/domain/user.domain'

export const e2eLogin = async (
  app: INestApplication,
  user: Pick<User, 'email' | 'password'>
): Promise<LoginResponseType> => {
  const response = await request(app.getHttpServer()).post('/auth/login').send({
    email: user.email,
    password: user.password,
  })
  expect(response.status).toBe(200)
  expect(response.body.data).toBeDefined()
  expect(response.body.data.token).toBeDefined()
  return response.body.data
}
