import { Router } from 'express'
import { UserController } from '../controllers/auth.controller'

export const AuthRouter: Router = Router()

// eslint-disable-next-line @typescript-eslint/unbound-method
AuthRouter.post('/register', UserController.register)
AuthRouter.post('/login', UserController.login)
// AuthRouter.post('/refresh', refreshSession)
