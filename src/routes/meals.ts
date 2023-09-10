import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserInformad } from '../middlewares/check-user-informad'

export async function mealsRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealBody = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string(),
      withinTheDiet: z.boolean(),
      userId: z.string(),
    })

    const { name, description, dateTime, withinTheDiet, userId } =
      createMealBody.parse(request.body)

    const meal = await knex('meals')
      .insert({
        id: randomUUID(),
        name,
        description,
        date_time: dateTime,
        within_the_diet: withinTheDiet,
        user_id: userId,
      })
      .returning('*')

    return reply.status(201).send(meal[0])
  })

  app.get(
    '/',
    {
      preHandler: [checkUserInformad],
    },
    async (request, reply) => {
      const { userId } = request.query

      const meals = await knex('meals').where('user_id', userId)

      return reply.send(meals)
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkUserInformad],
    },
    async (request, reply) => {
      const { userId } = request.query

      const meals = await knex('meals').where('user_id', userId)

      let bestSequence = 0
      let counter = 0

      meals.forEach((meal, index) => {
        if (meal.within_the_diet && meals[index - 1]?.within_the_diet) {
          counter = counter + 1
          return
        }
        console.log('Testeando')
        if (counter > bestSequence) {
          bestSequence = counter + 1
        }
        counter = 0
      })

      if (counter > bestSequence) {
        bestSequence = counter + 1
      }
      return reply.send({
        total: meals.length,
        totalWithinDiet: meals.filter((m) => m.within_the_diet).length,
        totalNotWithinDiet: meals.filter((m) => !m.within_the_diet).length,
        bestSequence,
      })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserInformad],
    },
    async (request, reply) => {
      const { userId } = request.query

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const updateMealBody = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string(),
        withinTheDiet: z.boolean(),
      })

      const { name, description, dateTime, withinTheDiet } =
        updateMealBody.parse(request.body)

      const meal = await knex('meals')
        .update({
          name,
          description,
          date_time: dateTime,
          within_the_diet: withinTheDiet,
        })
        .where({
          user_id: userId,
          id,
        })
        .returning('*')

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found!',
        })
      }

      return { meal }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserInformad],
    },
    async (request, reply) => {
      const { userId } = request.query

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          user_id: userId,
          id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found!',
        })
      }

      return { meal }
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserInformad],
    },
    async (request, reply) => {
      const { userId } = request.query

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals').delete().where({
        user_id: userId,
        id,
      })

      return reply.status(204).send()
    },
  )
}
