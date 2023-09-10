import fastify from 'fastify'

export const app = fastify()

app.post('/usuarios', async (request, reply) => {
  return reply.status(201).send()
})
