import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUserInformad(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = request.query

  if (!userId) {
    return reply.status(400).send({
      message: 'User not informad!',
    })
  }
}
