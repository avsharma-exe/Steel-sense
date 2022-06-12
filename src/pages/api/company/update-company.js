import { cryptPassword } from '../../../helpers/encrypt'
import Company from '../../../server/queries/Company/Company'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  try {
      const basicCompanyDetails = body
      basicCompanyDetails['UpdatedBy'] = body.user
      basicCompanyDetails['UpdatedDT'] = new Date().getDate()
      delete body.user

      // add new user to UserMaster
      let result = await Company.Update.updateCompany(basicCompanyDetails)

      if (result) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'Company updated successfully',
          result,
          company_details
        })
      }
  } catch (e) {
    throw e
  }
}
