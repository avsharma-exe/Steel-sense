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
    let i = 0;
    for (let inward of approvalList) {
      delete approvalList[i].inward
      let ExpectedDate = approvalList[i].ExpectedDate
      ExpectedDate = ExpectedDate ? ExpectedDate.split('-').reverse() : ExpectedDate
      ExpectedDate = ExpectedDate.join('-')
      let user = approvalList[i].User_ID
      let indent = approvalList[i].indent
      delete approvalList[i].InvoiceDate
      delete approvalList[i].ExpectedDate
      delete approvalList[i].indent
      const updateProductStockIndentParticulars = await Indent.Update.indentMultipleParticular(
        approvalList[i].Quantity,
        ExpectedDate,
        indent,
        99
      )
      const updateApprovedBy = await Indent.Update.updateIndentApprovedBy(user, approvalList[i].Indent_ID)
      const createProductStockInwardVoucher = await Indent.Create.productStockInwardVoucher(approvalList[i])
      inward['P_Stock_In_Voucher_ID'] = createProductStockInwardVoucher.insertId
      const createProductStockInward = await Indent.Create.productStockInward(inward)
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
