import Indent from '../../../server/queries/Indent/Indent'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  // console.log(body)
  try {
    const inward = body.inward
    delete body.inward
    let ExpectedDate = body.InvoiceDate
    delete body.InvoiceDate

    const updateProductStockIndentParticulars = await Indent.Update.indentParticular(body.Quantity, ExpectedDate)
    const createProductStockInwardVoucher = await Indent.Create.productStockInwardVoucher(body)
    inward['P_Stock_In_Voucher_ID'] = createProductStockInwardVoucher.insertId
    console.log(inward)
    const createProductStockInward = await Indent.Create.productStockInward(inward)
    console.log(createProductStockInward, updateProductStockIndentParticulars)
    if (createProductStockInward) {
      res.send({
        error: false,
        msg: 'Product Purchase Order Created'
      })
    }
  } catch (e) {
    throw e
  }
}
