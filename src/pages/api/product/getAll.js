import { cryptPassword } from '../../../helpers/encrypt'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company

  try {
    let getAllProducts = await Product.Read.getAllProductsIDsOfACompany(Co_ID)
    let allProducts = []
    if(getAllProducts.length === 0) res.send({
      error: true,
      msg: "Products Not Found"
    })

    for (let i = 0; i < getAllProducts.length; i++) {
      let product = getAllProducts[i]
      const productDetails = await Product.Read.getProductMasterData(product.P_ID)
      const priceDetails = await Product.Read.getProductPriceDetailsData(product.P_ID)
      const stockDetails = await Product.Read.getProductStockData(product.P_ID,product.Div_ID)

      let product_details = {
        productDetails,
        priceDetails,
        stockDetails
      }

      // console.log("index" , getAllProducts.length , i)
      allProducts.push(product_details)
      if (i >= getAllProducts.length - 1) {
        res.send({
          error: false,
          allProducts
        })
      }
    }
  } catch (e) {
    throw e
  }
}
