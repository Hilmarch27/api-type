import { Request, Response } from 'express'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validations/auth.validation'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { checkPassword, hashing } from '../utils/hashing'
import { createUser, findUserByEmail } from '../services/auth.service'
import { signJWT, verifyJWT } from '../utils/jwt'

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()
  const { error, value } = createUserValidation(req.body)
  if (error) {
    console.error('Error caught in registerUser:', error)
    logger.error('ERR: auth - register =', error)
    return res.status(422).send({ status: false, statusCode: 422, message: 'Validation error', data: {} })
  }
  try {
    value.password = `${hashing(value.password)}` // Assuming hashing function is correctly defined
    await createUser(value)
    return res.status(201).send({ status: true, statusCode: 201, message: 'success add new user' })
  } catch (error) {
    console.error('Error caught in registerUser:', error)
    logger.error('ERR: auth - register = ', error)
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal Server Error' })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)
  if (error) {
    console.error('Error caught in createSession:', error)
    console.error('ERR: auth - login first =', error)
    return res.status(422).send({ status: false, statusCode: 422, message: 'Validation error', data: {} })
  }
  try {
    const user: any = await findUserByEmail(value.email)
    const isValid = checkPassword(value.password, user.password)

    if (!isValid) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid email or password' })
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '4s' })

    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'success login', data: { accessToken, refreshToken } })
  } catch (error: any) {
    console.error('Error caught in createSession:', error)
    console.error('ERR: auth - login = ', error)
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal Server Error' })
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)
  if (error) {
    logger.error('ERR: auth - refresh session =', error)
    return res.status(422).send({ status: false, statusCode: 422, message: 'Validation error' })
  }
  try {
    const { decoded }: any = verifyJWT(value.refreshToken)

    const user = await findUserByEmail(decoded._doc.email)
    if (!user) return false

    const accessToken = signJWT(
      {
        ...user
      },
      { expiresIn: '1d' }
    )
    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'success refresh session', data: { accessToken } })
  } catch (error: any) {
    console.error('Error caught in refresh session:', error)
    return res.status(422).send({ status: false, statusCode: 422, message: 'Validation error' })
  }
}
