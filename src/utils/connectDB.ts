import mongoose from 'mongoose'
import config from '../config/environment'
import { logger } from '../application/logger'

mongoose
  .connect(`${config.db}`)
  .then(() => {
    logger.info('Connected to DB')
  })
  .catch((err) => {
    logger.info('could not connect to DB', err)
    process.exit(1)
  })
