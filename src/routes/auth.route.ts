import { Router } from 'express'
import { UserController } from '../controllers/auth.controller'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', UserController.register)
AuthRouter.post('/login', UserController.login)
AuthRouter.post('/refresh', UserController.refresh)
