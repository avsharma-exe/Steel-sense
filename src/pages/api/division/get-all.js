import { cryptPassword } from '../../../helpers/encrypt'
import Division from '../../../server/queries/Division/Division'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.coid
  try {

      let allDivisions = await Division.Read.getAllDivisionsOfACompany(Co_ID)



      if (allDivisions) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          allDivisions
        })
      }
  } catch (e) {
    throw e
  }
}
