declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      nome: string
      idade: number
      peso: number
      altura: number
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      name: string
      description: string
      date_time: string
      within_the_diet: boolean
      created_at: string
      updated_at: string
      user_id: string
    }
  }
}
