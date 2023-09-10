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

  it('should be able to create a new meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        nome: 'User test 1',
        idade: 36,
        peso: 78,
        altura: 1.56,
      })
      .expect(201)

    const meal = await request(app.server)
      .post('/meals')
      .send({
        name: 'Refeição 1',
        description: 'Macarronada',
        dateTime: '2023-09-10 15:21:21',
        withinTheDiet: true,
        userId: user.body.id,
      })
      .expect(201)

    expect(meal.body).toEqual(
      expect.objectContaining({
        name: 'Refeição 1',
        description: 'Macarronada',
      }),
    )
  })
})
