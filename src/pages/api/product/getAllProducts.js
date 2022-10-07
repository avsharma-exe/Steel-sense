import { cryptPassword } from '../../../helpers/encrypt'
import Product from '../../../server/queries/Product/Product'

/**
 *
 *This API si for inventory management only
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company

  try {
    let allProducts = await Product.Read.getAllProducts(Co_ID)
    if (allProducts.length === 0) {
      res.send({
        error: true,
        msg: 'Products Not Found'
      })
    } else {
      res.send({
        error: false,
        allProducts
      })
    }
  } catch (e) {
    throw e
  }
}
