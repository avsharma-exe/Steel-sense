import { cryptPassword } from '../../../helpers/encrypt'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company

  try {
    let allProducts = await Product.Read.getAllProductsIDsOfACompany(Co_ID)
    if(allProducts.length === 0){
      res.send({
        error: true,
        msg: "Products Not Found"
      })
    } else {
      res.send({
        error: false,
        allProducts
      })
    }

    // let p_id = getAllProducts.filter(p => {return(p.P_ID)})

    // const productDetails = await Product.Read.getProductMasterData(p_id)
    // const priceDetails = await Product.Read.getProductPriceDetailsData(p_id)
    // const stockDetails = await Product.Read.getProductStockData(Co_ID,Div_ID)


    // let product_details = {
    //   productDetails,
    //   priceDetails,
    //   stockDetails
    // }

    // console.log("index" , getAllProducts.length , i)
    // allProducts.push(product_details)
  } catch (e) {
    throw e
  }
}
