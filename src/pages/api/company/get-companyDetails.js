import { cryptPassword } from '../../../helpers/encrypt'
import Company from '../../../server/queries/Company/Company'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  const body = req.query
  try {
      let Co_ID = body.Co_ID
      console.log(Co_ID)
      let companyDetails = await Company.Read.getCompanyDetailsData(Co_ID)


      if (companyDetails && companyDetails.length) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          companyDetails
        })
      }
  } catch (e) {
    throw e
  }
}
