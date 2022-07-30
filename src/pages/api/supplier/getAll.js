import { cryptPassword } from '../../../helpers/encrypt'
import Company from '../../../server/queries/Company/Company'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.coid
  try {
    let allCompanies = await Company.Read.getAllSuppliers(Co_ID)

    if (allCompanies) {
      res.send({
        error: false,
        allCompanies
      })
    }
  } catch (e) {
    throw e
  }
}
