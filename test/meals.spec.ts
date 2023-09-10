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
    const user = await request(app.server).post('/users').send({
      nome: 'User test 1',
      idade: 36,
      peso: 78,
      altura: 1.56,
    })

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

  it('should be able to list all meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        nome: 'User test 1',
        idade: 36,
        peso: 78,
        altura: 1.56,
      })
      .expect(201)

    await request(app.server).post('/meals').send({
      name: 'Refeição 1',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: true,
      userId: user.body.id,
    })

    await request(app.server).post('/meals').send({
      name: 'Refeição 2',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: false,
      userId: user.body.id,
    })

    const listMeals = await request(app.server)
      .get(`/meals?userId=${user.body.id}`)
      .expect(200)

    expect(listMeals.body.length).toEqual(2)

    expect(listMeals.body[0]).toEqual(
      expect.objectContaining({
        name: 'Refeição 1',
        description: 'Macarronada',
      }),
    )
  })

  it('should be able to specific meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        nome: 'User test 1',
        idade: 36,
        peso: 78,
        altura: 1.56,
      })
      .expect(201)

    const mealCreate = await request(app.server).post('/meals').send({
      name: 'Refeição 1',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: true,
      userId: user.body.id,
    })

    const meal = await request(app.server)
      .get(`/meals/${mealCreate.body.id}?userId=${user.body.id}`)
      .expect(200)

    expect(meal.body.meal).toEqual(
      expect.objectContaining({
        name: 'Refeição 1',
        description: 'Macarronada',
      }),
    )
  })

  it('should be able to delete meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        nome: 'User test 1',
        idade: 36,
        peso: 78,
        altura: 1.56,
      })
      .expect(201)

    const mealCreate = await request(app.server).post('/meals').send({
      name: 'Refeição 1',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: true,
      userId: user.body.id,
    })

    const meal = await request(app.server)
      .delete(`/meals/${mealCreate.body.id}?userId=${user.body.id}`)
      .expect(204)
  })

  it('should be able to update meal', async () => {
    const user = await request(app.server).post('/users').send({
      nome: 'User test 1',
      idade: 36,
      peso: 78,
      altura: 1.56,
    })

    const mealCreate = await request(app.server).post('/meals').send({
      name: 'Refeição 1',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: true,
      userId: user.body.id,
    })

    const meal = await request(app.server)
      .put(`/meals/${mealCreate.body.id}?userId=${user.body.id}`)
      .send({
        name: 'Refeição Alterada',
        description: 'Macarronada alterada',
        dateTime: '2023-09-10 15:21:21',
        withinTheDiet: true,
        userId: user.body.id,
      })
      .expect(200)

    expect(meal.body.meal[0]).toEqual(
      expect.objectContaining({
        name: 'Refeição Alterada',
        description: 'Macarronada alterada',
      }),
    )
  })

  it('should be able to list metrics meals', async () => {
    const user = await request(app.server).post('/users').send({
      nome: 'User test 1',
      idade: 36,
      peso: 78,
      altura: 1.56,
    })

    await request(app.server).post('/meals').send({
      name: 'Refeição 1',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: true,
      userId: user.body.id,
    })

    await request(app.server).post('/meals').send({
      name: 'Refeição 2',
      description: 'Macarronada',
      dateTime: '2023-09-10 15:21:21',
      withinTheDiet: true,
      userId: user.body.id,
    })

    const metrics = await request(app.server)
      .get(`/meals/metrics?userId=${user.body.id}`)
      .expect(200)

    expect(metrics.body).toEqual(
      expect.objectContaining({
        total: 2,
        totalWithinDiet: 2,
        totalNotWithinDiet: 0,
        bestSequence: 2,
      }),
    )
  })
})
