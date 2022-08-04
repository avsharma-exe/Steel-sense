import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body

  try {
    let userfeilds = { CreatedBy: body.userDetails.User_ID, UpdateBy: body.userDetails.User_ID }

    const productDetails = {
      PName: body.productDetails.productName,
      ...userfeilds
    }

    const addProductDetails = await Product.Create.createNewProduct(productDetails)

    const priceDetails = {
      P_ID: addProductDetails.insertId,
      PurchasePrice: body.productDetails.purchasePrice,
      LastPurchasePrice: body.productDetails.purchasePrice,
      Unit: body.productDetails.unit,
      ...userfeilds
    }

    await Object.keys(body.allStocks).forEach(async division => {
      let stock = body.allStocks[division]

      const productStockDetails = {
        P_ID: addProductDetails.insertId,
        CurrentStock: stock.openingStock,
        LastStock: stock.openingStock,
        LowStockLimit: stock.LowStockLimit,
        MaxStockLimit: stock.MaxStockLimit,
        Div_ID: division,
        ...userfeilds
      }
      await Product.Create.createProductStockDetails(productStockDetails)
    })

    await Object.keys(body.allStocks).map(async division => {
      await Product.Create.createProductCompanyDivision({
        Co_ID: body.userDetails.Co_ID,
        P_ID: addProductDetails.insertId,
        Div_ID: division,
        ...userfeilds
      })
    })

    const addProductPriceDetails = await Product.Create.createProductPriceDetails(priceDetails)


    if (addProductPriceDetails) {
      res.send({
        error: false,
        msg: 'Product added successfully'
      })
    }
  } catch (e) {
    throw e
  }
}
