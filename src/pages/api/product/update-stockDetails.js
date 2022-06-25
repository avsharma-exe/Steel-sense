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
      let temp = body.stockDetails
      const productStockDetails = {
        CurrentStock: temp.CurrentStock,
        LastStock: temp.CurrentStock,
        CreatedDT: temp.CreatedDT,
        CreatedBy: temp.CreatedBy,
        UpdateBy: temp.UpdateBy
      }
      console.log(productStockDetails,'AAAAAAAAAAAAAA')
      const product_ID = temp.P_ID
      delete productStockDetails.P_ID
      let date = new Date()
      // 2021-07-02 23:29:08.000000
      productStockDetails['UpdatedDT'] = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      // Update User details in COmpnay_User
      let result = await Product.Update.updateStockDetails(productStockDetails,product_ID)

      if (result) {
        res.send({
          error: false,
          msg: 'Product Stock Details updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
