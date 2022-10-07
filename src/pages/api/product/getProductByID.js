import { ContentSaveOutline } from 'mdi-material-ui'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let P_ID = req.query.product
  let Div_ID = req.query.division
  try {
    let product = await Product.Read.getProductMasterData(P_ID)
    let productUnit = await Product.Read.getProductPriceDetailsData(P_ID)

    console.log('productUnit' , productUnit)
    
    product[0]['UnitName'] = productUnit[0]['Unit']
    console.log("Div_ID" , Div_ID, typeof Div_ID)
    let p_stock =
      Div_ID === "-1"
        ? await Product.Read.getProductStockDataByIDAllDivisions(P_ID)
        : await Product.Read.getProductStockDataByID(P_ID, Div_ID)
      
    console.log(p_stock)
    if (product.length === 0)
      res.send({
        error: true,
        msg: 'Products Not Found'
      })

    if (product) {
      res.send({
        error: false,
        product,
        p_stock
      })
    }
  } catch (e) {
    throw e
  }
}
