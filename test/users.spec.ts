import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        nome: 'User test 1',
        idade: 36,
        peso: 78,
        altura: 1.56,
      })
      .expect(201)

    expect(user.body).toEqual(
      expect.objectContaining({
        nome: 'User test 1',
        idade: 36,
        peso: 78,
        altura: 1.56,
      }),
    )
  })
})
