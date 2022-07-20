import { cryptPassword } from '../../../helpers/encrypt'
import User from '../../../server/queries/User/User'
import Division from '../../../server/queries/Division/Division'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let User_ID = req.query.user_id
  let Co_ID = req.query.co_id
  let Role = req.query.role

  try {
    let userDivisions = []
    if (String(Role) === '2') {
      userDivisions = await Division.Read.getAllDivisionsOfACompany(Co_ID)
      
      if (userDivisions) {
        res.send({
          error: false,
          userDivisions
        })
      }

      return 
    } 
    
    userDivisions = await User.Read.getUserDivisions(User_ID)

    if (userDivisions) {
      res.send({
        error: false,
        userDivisions
      })
    }

    return 
  } catch (e) {
    throw e
  }
}
