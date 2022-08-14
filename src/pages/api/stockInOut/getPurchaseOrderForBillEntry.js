import StockInOut from '../../../server/queries/StockInOut/StockInOut'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  try {
    let allBillEntries = await StockInOut.Read.getBillEntries(req.query.company)

    if (allBillEntries) {
      res.send({
        error: false,
        allBillEntries
      })
    }
  } catch (e) {
    throw e
  }
}
