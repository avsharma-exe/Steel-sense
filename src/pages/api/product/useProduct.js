import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
    let product = body.product

    const productStockDetails = {
      CurrentStock: product.CurrentStock - product.stockUsed,
      LastStock: product.CurrentStock,
      UpdateBy: product.user
    }

    const product_ID = product.P_STOCK_ID

    let date = new Date()
    productStockDetails['UpdatedDT'] =
      date.getFullYear() +
      '-' +
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()

    const stockUsage = {
      Used_By: product.user,
      Used_On: productStockDetails['UpdatedDT'],
      Qty_Used: product.stockUsed,
      P_ID: product.P_ID,
      P_STOCK_ID: product.P_STOCK_ID
    }

    const updateProductStock = await Product.Update.updateProductStock(productStockDetails, product_ID)
    const createStockUsageLog = await Product.Create.createStockUsageLog(stockUsage)

    if (updateProductStock && createStockUsageLog)
      res.send({
        error: false,
        msg: 'Product Stock Details updated successfully'
      })
  } catch (e) {
    throw e
  }
}
