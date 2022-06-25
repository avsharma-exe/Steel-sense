import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
      const productDetails = body.productDetails
      console.log(productDetails)
      const product_ID = productDetails.P_ID
      delete productDetails.P_ID
      // Update User details in COmpnay_User
      let result = await Product.Update.updateProductMaster(productDetails,product_ID)

      if (result) {
        res.send({
          error: false,
          msg: 'Product Master updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
