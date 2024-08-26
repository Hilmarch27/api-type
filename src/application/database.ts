import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'warn'
    }
  ]
})

prismaClient.$on('error', (e: unknown) => {
  logger.error(e)
})

prismaClient.$on('warn', (e: unknown) => {
  logger.warn(e)
})

prismaClient.$on('info', (e: unknown) => {
  logger.info(e)
})

prismaClient.$on('query', (e: unknown) => {
  logger.info(e)
})
