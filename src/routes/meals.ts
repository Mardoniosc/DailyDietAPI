import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

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
}
