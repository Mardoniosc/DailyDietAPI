import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBody = z.object({
      nome: z.string(),
      idade: z.number(),
      peso: z.number(),
      altura: z.number(),
    })

    const { nome, idade, peso, altura } = createUserBody.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      nome,
      idade,
      peso,
      altura,
    })

    return reply.status(201).send()
  })
}
