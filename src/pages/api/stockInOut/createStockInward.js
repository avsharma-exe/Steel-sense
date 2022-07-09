import StockInOut from '../../../server/queries/StockInOut/StockInOut'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }
  let body = req.body
  try {
    console.log(req.body.inward,req.body.voucher,"Here")
    const voucher = body.voucher
    const inward = body.inward
    voucher['CreatedBy'] = body.user
    voucher['CreatedDt'] = new Date().getDate()
    delete body.user
    let inwardData = null

    // add new inward stock
    let result = await StockInOut.Create.createStockInwardVoucher(voucher).then(res =>  {
      inward['P_Stock_In_Voucher_ID'] = res.insertId
      inwardData = StockInOut.Create.createStockInward(inward)
    })

    if (result && inwardData) {
      // TODO: add mail service to send the credentials
      res.send({
        error: false,
        msg: 'Stock inward is success',
        result,
        inwardData,
      })
    }
  } catch (e) {
    throw e
  }
}
