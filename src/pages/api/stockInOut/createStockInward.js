import StockInOut from '../../../server/queries/StockInOut/StockInOut'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }
  let body = req.body
  try {
    body['CreatedBy'] = body.user
    let date = new Date()
    let CreatedDt = date.getFullYear() +
      '-' + parseInt(date.getMonth() + 1) +
      '-' + date.getDate() +
      ' ' + date.getHours() +
      ':' + date.getMinutes()
    body['CreatedDt'] = CreatedDt
    delete body.user
    let status = body.status
    delete body.status
    let voucher_id = body.P_Stock_In_Voucher_ID
    delete body.P_Stock_In_Voucher_ID
    let in_id = body.P_Stock_In_ID
    delete body.P_Stock_In_ID

    console.log(body)
    let updateStock = null
    // add new inward stock
    let result = await StockInOut.Update.updateProductStockInwardVoucher(body, voucher_id).then(
      updateStock = await StockInOut.Update.updateStockInward(body['Quantity'], body['P_ID'])
    )



    if (result && updateStock) {
      let statusUpdate = await StockInOut.Update.updateProductStockInwardStatus(status, in_id)
      if( statusUpdate ){
      // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'Stock inward is success',
          result,
          updateStock,
          statusUpdate
        })
      }
    }
  } catch (e) {
    throw e
  }
}
