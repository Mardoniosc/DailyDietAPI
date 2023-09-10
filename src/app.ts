import fastify from 'fastify'
import { mealsRoute } from './routes/meals'
import { usersRoute } from './routes/users'

export const app = fastify()

app.register(usersRoute, {
  prefix: 'users',
})

app.register(mealsRoute, {
  prefix: 'meals',
})
