import { Validation } from '../validations/validation'
import {
  CreateUserRequest,
  LoginUserRequest,
  RefreshTokenUserRequest,
  toUserResponse,
  UserResponse
} from '../models/user.model'
import { UserValidation } from '../validations/auth.validation'
import { checkPassword, hashing } from '../utils/hashing'
import { prismaClient } from '../application/database'
import { ResponseError } from '../error/reponse-error'
import { signJWT, verifyJWT } from '../utils/jwt'
import { JwtPayload } from 'jsonwebtoken'

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request)
    registerRequest.password = `${hashing(registerRequest.password)}`
    const user = await prismaClient.user.create({
      data: registerRequest
    })
    return toUserResponse(user)
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginUserRequest = Validation.validate(UserValidation.LOGIN, request)
    let user = await prismaClient.user.findUnique({
      where: {
        email: loginUserRequest.email
      }
    })

    if (!user) {
      throw new ResponseError(401, 'username or Password is wrong')
    }

    const isMatch = await checkPassword(loginUserRequest.password, user.password)
    if (!isMatch) {
      throw new ResponseError(401, 'username or Password is wrong')
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '4s' })

    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    const response = toUserResponse(user)
    response.accessToken = accessToken
    response.refreshToken = refreshToken

    return response
  }

  static async refresh(request: RefreshTokenUserRequest): Promise<UserResponse> {
    // Validate the refresh token request
    const refreshTokenUserRequest = Validation.validate(UserValidation.REFRESH, request)

    // Verify the provided refresh token
    const { valid, expired, decoded } = verifyJWT(refreshTokenUserRequest.refreshToken)

    if (!valid || expired || !decoded) {
      throw new ResponseError(401, 'Invalid or expired refresh token')
    }

    // Fetch user by email from the decoded token
    const user = await prismaClient.user.findUnique({
      where: { email: (decoded as JwtPayload).email }
    })

    if (!user) {
      throw new ResponseError(401, 'User not found')
    }

    // Generate a new access token and refresh token
    const accessToken = signJWT({ ...user }, { expiresIn: '15m' })
    const newRefreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    // Generate the user response and include tokens
    const response = toUserResponse(user, accessToken, newRefreshToken)

    return response
  }
}
