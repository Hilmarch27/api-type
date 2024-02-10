import { logger } from '../utils/logger'
import productModel from '../models/product.model'
import ProductType from '../types/product.type'

export const createProductToDB = async (payload: ProductType) => {
  return await productModel.create(payload)
}

export const getProductFromDB = async () => {
  return await productModel
    .find()
    .then((data) => {
      return data
    })
    .catch(() => {
      logger.info('cannot get product from DB')
      logger.error(Error)
    })
}

export const getProductById = async (id: string) => {
  return await productModel
    .findOne({ product_id: id })
    .then((data) => {
      return data
    })
    .catch(() => {
      logger.info('cannot get product from DB')
      logger.error(Error)
    })
}

export const updateProductById = async (id: string, payload: ProductType) => {
  const result = await productModel.findOneAndUpdate(
    {
      product_id: id
    },
    { $set: payload }
  )
  return result
}

export const deleteProductById = async (id: string) => {
  const result = await productModel.findOneAndDelete({ product_id: id })
  return result
}
