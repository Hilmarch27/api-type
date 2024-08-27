import { Router, Request, Response, NextFunction } from 'express'
import { logger } from '../application/logger'
import { requireUser } from '../middleware/auth'

export const ProductRouter: Router = Router()

//check if server is running
ProductRouter.get('/', requireUser, (req: Request, res: Response, next: NextFunction) => {
  logger.info('success')
  res.status(200).send('protected route')
})
