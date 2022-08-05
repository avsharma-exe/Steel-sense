import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
    // CurrentStock: 10,
    // LastStock: 10,
    // CreatedDT: null,
    // CreatedBy: 12,
    // UpdatedDT: null,
    // UpdateBy: 12,
    let stocks = body.stockDetails
    let i = 0;
    for (let temp of stocks) {
      
      const productStockDetails = {
        CurrentStock: temp.CurrentStock,
        LastStock: temp.CurrentStock,
        CreatedDT: temp.CreatedDT,
        LowStockLimit: temp.LowStockLimit,
        MaxStockLimit: temp.MaxStockLimit,
        CreatedBy: temp.CreatedBy,
        UpdateBy: body.userDetails.User_ID
      }

      const product_ID = temp.P_ID
      delete productStockDetails.P_ID
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
      // Update User details in COmpnay_User
      await Product.Update.updateStockDetails(productStockDetails, product_ID)
      i++;
    }
    if (i === stocks.length) {
      res.send({
        error: false,
        msg: 'Product Stock Details updated successfully',
      })
    }
  } catch (e) {
    throw e
  }
}
