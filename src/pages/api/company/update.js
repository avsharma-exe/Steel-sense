import { cryptPassword } from '../../../helpers/encrypt'
import Company from '../../../server/queries/Company/Company'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
      const basicCompanyDetails = body
      basicCompanyDetails['UpdatedBy'] = body.user
      basicCompanyDetails['UpdatedDT'] = new Date().getDate()
      const company_ID = body.company_ID
      delete body.user
      delete body.company_ID

      // add new user to UserMaster
      let result = await Company.Update.updateCompany(basicCompanyDetails,company_ID)

      if (result) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'Company updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
