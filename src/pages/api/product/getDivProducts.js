import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company

  let divisions =
    req.query['userDivisions[]'].length === 1 ? [req.query['userDivisions[]']] : req.query['userDivisions[]']

  try {
    let getAllProducts = await Product.Read.getAllProductsIDsOfACompanyByDivision(Co_ID, divisions)
    console.log(getAllProducts)
    let allProducts = []
    if (getAllProducts.length === 0)
      res.send({
        error: true,
        msg: 'Products Not Found'
      })

    for (let i = 0; i < getAllProducts.length; i++) {
      let product = getAllProducts[i]
      const productDetails = await Product.Read.getProductMasterData(product.P_ID)
      const priceDetails = await Product.Read.getProductPriceDetailsData(product.P_ID)
      const stockDetails = await Product.Read.getProductStockData(product.P_ID, product.Div_ID)

      console.log(stockDetails)

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

  // try {
  //   let allProducts = await Product.Read.getAllDivsionProducts(Co_ID, divisions)

  //   if (allProducts.length === 0)
  //     res.send({
  //       error: true,
  //       msg: 'Products Not Found'
  //     })

  //   if (allProducts) {
  //     res.send({
  //       error: false,
  //       allProducts
  //     })
  //   }
  // } catch (e) {
  //   throw e
  // }
}
