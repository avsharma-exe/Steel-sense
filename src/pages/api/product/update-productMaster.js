import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {

      const productDetails = body

      console.log(body)

      // console.log(productDetails)
      const product_ID = productDetails.P_ID
      const productMaster = {
        PName: productDetails.PName
      }

      productDetails["purchasePrice"] = productDetails.PricePerUnit

      delete productDetails.PricePerUnit;
      delete productDetails.PName;
      delete productDetails.P_ID;
      // Update User details in COmpnay_User
      let resultProductMaster = await Product.Update.updateProductMaster(productDetails,product_ID)
      let resultPriceMaster = await Product.Update.updatePriceDetails(productDetails , product_ID)

      if (resultProductMaster && resultPriceMaster) {
        res.send({
          error: false,
          msg: 'Product Master updated successfully',
        })
      }
  } catch (e) {
    throw e
  }
}
