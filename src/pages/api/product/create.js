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

     const productStockDetails = {
        P_ID: addProductDetails.insertId,
        CurrentStock: body.stockDetails.openingStock,
        LastStock: body.stockDetails.openingStock,
        ...userfeilds
     }

     const productUnit = {
        P_ID: addProductDetails.insertId,
        UnitName: body.stockDetails.unit,
        ...userfeilds
     }
     

    const addProductPriceDetails = await Product.Create.createProductPriceDetails(priceDetails)
    
    const createProductGstDetails = await Product.Create.createProductGSTDetails(productGstDetails)

    const createProductStockDetails = await Product.Create.createProductStockDetails(productStockDetails)

    const createProductUnit = await Product.Create.createProductUnitDetails(productUnit);

    const createProductCompanyDivision = await Product.Create.createProductCompanyDivision({
        Co_ID: body.userDetails.Co_ID,
        P_ID: addProductDetails.insertId,
        ...userfeilds
    })


    if (addProductPriceDetails && createProductCompanyDivision && createProductGstDetails && createProductStockDetails && createProductUnit) {
        
        res.send({
          error: false,
          msg: 'Product added successfully',
        })
      }
  } catch (e) {
    throw e
  }
}
