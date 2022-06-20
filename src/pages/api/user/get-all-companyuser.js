import { cryptPassword } from '../../../helpers/encrypt'
import User from '../../../server/queries/User/User'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }


  try {

      let allUsers = await User.Read.getAllCompanyUsers(req.query.coid)

      if (allUsers) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          allUsers
        })
      }
  } catch (e) {
    throw e
  }
}
