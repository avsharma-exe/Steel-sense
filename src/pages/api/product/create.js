import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body

  try {
    let date = new Date()
    // 2021-07-02 23:29:08.000000
    date =
      date.getFullYear() +
      '-' +
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    let userfeilds = {
      CreatedBy: body.userDetails.User_ID,
      UpdateBy: body.userDetails.User_ID,
      CreatedDT: date,
      UpdatedDT: date
    }

    const productDetails = {
      PName: body.productDetails.productName,
      status: 50,
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

    Object.keys(body.allStocks).forEach(async division => {
      let stock = body.allStocks[division]
      console.log(division, ' ---- ', body.allStocks[division], ' ------ ')
      const productStockDetails = {
        P_ID: addProductDetails.insertId,
        CurrentStock: stock.openingStock,
        LastStock: stock.openingStock,
        LowStockLimit: stock.LowStockLimit,
        MaxStockLimit: stock.MaxStockLimit,
        Div_ID: division,
        ...userfeilds
      }
      console.log(division, ' ---- ', body.allStocks[division], ' ------ ', productStockDetails)
      await Product.Create.createProductStockDetails(productStockDetails)
    })

    Object.keys(body.allStocks).map(async division => {
      await Product.Create.createProductCompanyDivision({
        Co_ID: body.userDetails.Co_ID,
        P_ID: addProductDetails.insertId,
        Div_ID: division,
        ...userfeilds
      })
      console.log(division, ' ---- ')
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
