import BillEntries from 'src/server/queries/BillEntries/BillEntries'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  const { billEntry } = req.query

  try {
    let billEntryDetails = await BillEntries.Read.getBillEntryDetails(billEntry)
    let billEntryProducts = await BillEntries.Read.getBillProducts(billEntry)
    if (billEntryDetails && billEntryProducts)
      res.send({
        error: false,
        billEntryDetails,
        billEntryProducts
      })
  } catch (e) {
    throw e
  }
}
