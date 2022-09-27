import BillEntries from 'src/server/queries/BillEntries/BillEntries'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let bill_id = req.query.bill
  try {
    let billDetails = await BillEntries.Read.getBillDetails(bill_id)

    if (billDetails)
      res.send({
        error: false,
        billDetails
      })
  } catch (e) {
    throw e
  }
}
