import { cryptPassword } from '../../../helpers/encrypt'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  let divisions = req.query['division[]']

  try {
    console.log(divisions.toString())
    const getLowStockProducts = await Product.Read.getLowStockProducts(Co_ID, divisions.toString())
    const allLowStockProducts = []
    if (getLowStockProducts.length === 0)
      res.send({
        error: true,
        msg: 'No Low Stock Products'
      })
      // console.log('length', getLowStockProducts.length);
    for (let i = 0; i < getLowStockProducts.length; i++) {
      let product = getLowStockProducts[i]
      const productDetails = await Product.Read.getProductMasterData(product.P_ID)

      product['PName'] = productDetails[0]['PName']

      // console.log('index', product, i)
      allLowStockProducts.push(product)
      if (i >= getLowStockProducts.length - 1) {
        res.send({
          error: false,
          allLowStockProducts
        })
      }
    }
  } catch (e) {
    throw e
  }
}
