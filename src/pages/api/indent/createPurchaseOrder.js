import Indent from '../../../server/queries/Indent/Indent'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  console.log(body)
  try {
    const inward = body.inward
    delete body.inward
    let ExpectedDate = body.ExpectedDate
    ExpectedDate = ExpectedDate ? ExpectedDate.split('-').reverse() : ExpectedDate
    ExpectedDate = ExpectedDate.join('-')

    let indent = body.indent
    delete body.InvoiceDate
    delete body.ExpectedDate
    delete body.indent
    const updateProductStockIndentParticulars = await Indent.Update.indentParticular(
      body.Quantity,
      ExpectedDate,
      indent
    )
    const createProductStockInwardVoucher = await Indent.Create.productStockInwardVoucher(body)
    inward['P_Stock_In_Voucher_ID'] = createProductStockInwardVoucher.insertId
    const createProductStockInward = await Indent.Create.productStockInward(inward)
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
