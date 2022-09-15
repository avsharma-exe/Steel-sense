import BillEntries from 'src/server/queries/BillEntries/BillEntries'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  try {
    let allBills = await BillEntries.Read.getBillEntries(Co_ID)

    if (allBills)
      res.send({
        error: false,
        allBills
      })
  } catch (e) {
    throw e
  }
}
