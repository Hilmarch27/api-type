import { Request, Response } from 'express'
import { logger } from '../application/logger'
import { createProductValidation, updateProductValidation } from '../validations/product.validation'
import {
  getProductFromDB,
  createProductToDB,
  getProductById,
  updateProductById,
  deleteProductById
} from '../services/product.service'
import { v4 as uuidv4 } from 'uuid'

export const createProduct = async (req: Request, res: Response) => {
  req.body.product_id = uuidv4()
  const { error, value } = createProductValidation(req.body)
  if (error) {
    logger.error('ERR: product - create =', error.details[0].message)
    return res.status(422).send({ status: false, statuscode: 422, message: error.details[0].message, data: {} })
  }
  try {
    await createProductToDB(value)
    logger.info('success add new product')
    return res.status(200).send({ status: true, statuscode: 201, message: 'success add new product' })
  } catch (error) {
    logger.error('ERR: product - create =', error)
    return res.status(422).send({ status: false, statuscode: 422, message: error })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  if (id) {
    const product = await getProductById(id)
    if (product) {
      logger.info('success get one product')
      return res.status(200).send({ status: true, statuscode: 200, data: product })
    } else {
      logger.info('error get one product')
      return res.status(404).send({ status: true, statuscode: 404, message: 'data not found', data: { product } })
    }
  } else {
    const products: any = await getProductFromDB()
    logger.info('success get all product')
    return res.status(200).send({ status: true, statuscode: 200, data: products })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  const { error, value } = updateProductValidation(req.body)
  if (error) {
    logger.error('ERR: product - update = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const result = await updateProductById(id, value)
    if (result) {
      logger.info('Success update product')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Update product success' })
    } else {
      logger.info('Data Not Found')
      return res.status(404).send({ status: true, statusCode: 404, message: 'Data Not Found' })
    }
  } catch (error) {
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req
  try {
    const result = await deleteProductById(id)
    if (result) {
      logger.info('Success delete product')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Success delete product' })
    } else {
      logger.info('Data Not Found')
      return res.status(404).send({ status: true, statusCode: 404, message: 'Data Not Found' })
    }
  } catch (error) {
    logger.error('ERR: product - delete = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
