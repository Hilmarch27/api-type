import { NextFunction, Request, Response } from 'express'
import {
  createSessionValidation,
  createUserValidation,
  refreshSessionValidation
} from '../validations/auth.validations'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../application/logger'
import { checkPassword, hashing } from '../utils/hashing'
import { signJWT, verifyJWT } from '../utils/jwt'
import { CreateUserRequest, LoginUserRequest, RefreshTokenUserRequest } from '../models/user.model'
import { UserService } from '../services/auth.service'

export class UserController {
  static async register (req: Request, res: Response, next: NextFunction) {
    try {
      //? body req
      const request: CreateUserRequest = req.body as CreateUserRequest
      //? send to service
      const response = await UserService.register(request)
      //? send to client
      res.status(200).json({
        data: response
      })
    } catch (e) {
      next(e)
    }
  }

  static async login (req: Request, res: Response, next: NextFunction) {
    try {
      //? body req
      const request: LoginUserRequest = req.body as LoginUserRequest
      //? send to service
      const response = await UserService.login(request)
      //? send to client
      res.status(200).json({
        data: response
      })
    } catch (e) {
      next(e)
    }
  }
  
  static async refresh (req: Request, res: Response, next: NextFunction) {
    try {
      //? body req
      const request: RefreshTokenUserRequest = req.body as RefreshTokenUserRequest
      //? send to service
      const response = await UserService.login(refresh)
      //? send to client
      res.status(200).json({
        data: response
      })
    } catch (e) {
      next(e)
    }
  }
}