import executeQuery from '../../../server/Connection'
import { comparePassword } from '../../../helpers/encrypt'
import { createJwt } from '../../../helpers/jwt'
import User from '../../../server/queries/User/User'
import Role from '../../../server/queries/User/Role'
import Company from '../../../server/queries/Company/Company'


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body

  let result = await User.getUserDetails(body.email)

  // console.log(result)

  // check if user exists in the DB
  if (result.length > 0) {
    let user = result[0]

    //compare the password with bcrypt
    comparePassword(body.password, user['Password'], async (err, isMatch) => {
      if (err) throw err
      // is password match
      if (isMatch) {
        await User.changeLastLoginDate(user['User_ID'])
        // const companyDetails = await getUserCompany(user['User_ID'])
        const companyDetailsMap = await Company.getUserCompanyMap(user['User_ID'])
        const companyDetails = companyDetailsMap[0].Co_ID && await Company.getUserCompany(companyDetailsMap[0].Co_ID)
        const roleDetails = await Role.getUserRole(companyDetailsMap[0].Role_ID)
        // const rolePriviledge = await Role.getUserRolePriviledge(companyDetailsMap.Role_ID)[0]
        // TODO: Get app_pages from the array of page_ids from role priviledge
        const jwtToken = createJwt(user)
        user['role'] = companyDetailsMap[0].Co_ID ? roleDetails[0].RoleName : 'admin'
        res.send({
          error: false,
          msg: 'User login successfully',
          token: jwtToken,
          companyDetails,
          user
        })
      } else
        res.send({
          error: true,
          msg: 'Incorrect Password'
        })
    })
  } else
    res.send({
      error: true,
      msg: 'User Not Found'
    })
}
