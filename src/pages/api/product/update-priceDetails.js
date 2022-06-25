import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
      const productPriceDetails = body.priceDetails
      console.log(productPriceDetails,'AAAAAAAAAAAAAA')
      const product_ID = productPriceDetails.P_ID
      delete productPriceDetails.P_ID
      let date = new Date()
      // 2021-07-02 23:29:08.000000
      productPriceDetails['UpdatedDT'] = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      // Update User details in COmpnay_User
      let result = await Product.Update.updatePriceDetails(productPriceDetails,product_ID)

      if (result) {
        res.send({
          error: false,
          msg: 'Product Price Details updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
