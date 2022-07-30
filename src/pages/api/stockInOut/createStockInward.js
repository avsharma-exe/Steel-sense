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
    let status = body.status;
    delete body.status
    console.log(body)
    let updateStock = null
    // add new inward stock
    let result = await StockInOut.Create.createStockInwardVoucher(body).then(
      updateStock = await StockInOut.Update.updateStockInward(body['Quantity'], body['P_ID'])
    )

    if (result && updateStock) {
      // TODO: add mail service to send the credentials
      res.send({
        error: false,
        msg: 'Stock inward is success',
        result,
        updateStock,
      })
    }
  } catch (e) {
    throw e
  }
}
