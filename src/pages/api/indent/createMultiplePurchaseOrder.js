import Indent from '../../../server/queries/Indent/Indent'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  console.log(body)
  try {
    let approvalList = req.body
    console.log("approvalList" , approvalList)
    let i = 0;
    for (let inward of approvalList) {
      let Inward = inward.inward
      delete inward.inward
      let ExpectedDate = inward.ExpectedDate
      ExpectedDate = ExpectedDate ? ExpectedDate.split('-').reverse() : ExpectedDate
      ExpectedDate = ExpectedDate.join('-')
      let user = inward.User_ID
      let indent = inward.indent
      delete inward.User_ID
      delete inward.InvoiceDate
      delete inward.ExpectedDate
      delete inward.indent
      inward["CreatedBy"] = user
      await Indent.Update.indentMultipleParticular(
        inward.Quantity,
        ExpectedDate,
        indent,
        99
      )
      
      await Indent.Update.updateIndentApprovedBy(user, inward.Indent_ID)
      const createProductStockInwardVoucher = await Indent.Create.productStockInwardVoucher(inward)
      console.log(createProductStockInwardVoucher)
      Inward['P_Stock_In_Voucher_ID'] = createProductStockInwardVoucher.insertId
      const createProductStockInward = await Indent.Create.productStockInward(Inward)
      console.log(createProductStockInward)
      i++;
    }

    if (approvalList.length === i) {
      res.send({
        error: false,
        msg: 'Indent approved Successfully'
      })
    }
  } catch (e) {
    throw e
  }
}
