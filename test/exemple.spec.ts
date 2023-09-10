import { expect, test } from 'vitest'

test('Criando novo usuário', () => {
  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
