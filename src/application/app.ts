import * as dotenv from 'dotenv'
import express, { Application, urlencoded } from 'express'
import { errorMiddleware } from '../middleware/error.middleware'
import { routes } from '../routes'
import { logger } from './logger'
import cors from 'cors'
import deserializeToken from '../middleware/deserializedToken'
dotenv.config()

export const app: Application = express()
const port: Number = 5000

app.use(express.json())
app.use(urlencoded({ extended: false }))

app.use(errorMiddleware)

//cors access hanfler
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

app.use(deserializeToken)

routes(app)

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
