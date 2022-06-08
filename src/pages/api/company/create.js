import { cryptPassword } from '../../../helpers/encrypt'
import Company from '../../../server/queries/Company/Company'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  try {
      const companyDetails = body.companyDetails
      delete body.companyDetails

      // add new user to UserMaster
      let result = await Company.Create.createNewCompany(body)
      companyDetails['Co_ID'] = result.insertId
      let company_details = await Company.Create.createCompanyDetails(companyDetails)

      if (result && company_details) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'Company added successfully',
          result,
          company_details
        })
      }
  } catch (e) {
    throw e
  }
}
