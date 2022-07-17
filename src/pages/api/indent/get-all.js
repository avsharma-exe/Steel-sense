import Indent from '../../../server/queries/Indent/Indent'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company

  try {
    let allIndents = await Indent.Read.getAllIndentsOfACompany(Co_ID)
    if (allIndents) {
      res.send({
        error: false,
        allIndents
      })
    }
  } catch (e) {
    throw e
  }
}
