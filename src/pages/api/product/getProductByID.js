import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let P_ID = req.query.product

  try {
    let product = await Product.Read.getProductMasterData(P_ID)
    let productUnit = await Product.Read.getProductUnitData(P_ID)
    product[0]["UnitName"] = productUnit[0].UnitName
    let p_stock = await Product.Read.getProductStockData(P_ID)
    if(product.length === 0) res.send({
      error: true,
      msg: "Products Not Found"
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
