import Company from '../../../server/queries/Company/Company'
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
      PGroup: body.productDetails.productGroup,
      PBrand: body.productDetails.productBrand,
      PItemCode: body.productDetails.itemCode,
      PPrintName: body.productDetails.printName,
      ...userfeilds
    }

    const addProductDetails = await Product.Create.createNewProduct(productDetails)

    const priceDetails = {
      P_ID: addProductDetails.insertId,
      PurchasePrice: body.priceDetails.purchasePrice,

      SalePrice: body.priceDetails.salePrice,
      MinSalePrice: body.priceDetails.minSalePice,
      Product_Price_Detailscol: body.priceDetails.mrp,
      ...userfeilds
    }

    const productGstDetails = {
      P_ID: addProductDetails.insertId,
      HSN_SAC_Code: body.gstDetails.hsnCode,
      CGST: body.gstDetails.cgst,
      SGST: body.gstDetails.sgst,
      Cess: body.gstDetails.cess,
      IGST: body.gstDetails.igst,
      ...userfeilds
    }

    
    await Object.keys(body.allStocks).forEach(async division => {
      let stock = body.allStocks[division]
      
      const productUnit = {
        P_ID: addProductDetails.insertId,
        UnitName: stock.unit,
        ...userfeilds
      }
      await Product.Create.createProductUnitDetails(productUnit)
    })

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
    
    const createProductGstDetails = await Product.Create.createProductGSTDetails(productGstDetails)

    if (addProductPriceDetails && createProductGstDetails) {
      res.send({
        error: false,
        msg: 'Product added successfully'
      })
    }
  } catch (e) {
    throw e
  }
}
