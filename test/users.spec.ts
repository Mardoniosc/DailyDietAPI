import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        nome: 'User test 1',
        idade: 33,
        peso: 78,
        altura: 1.76,
      })
      .expect(201)
  })
})
