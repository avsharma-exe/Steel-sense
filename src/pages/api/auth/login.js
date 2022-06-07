import executeQuery from '../../../server/Connection'
import { comparePassword } from '../../../helpers/encrypt'
import { createJwt } from '../../../helpers/jwt'


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body

  let result = await executeQuery({
    query:
      'SELECT User_ID, Username, FirstName,Password, LastName, Email, MobileNo, LastLoginDate FROM User_Master where Email = ?',
    values: [body.email]
  })

  // console.log(result)

  // check if user exists in the DB
  if (result.length > 0) {
    let user = result[0]

    //compare the password with bcrypt
    comparePassword(body.password, user['Password'], async (err, isMatch) => {
      if (err) throw err
      // is password match
      if (isMatch) {
        await changeLastLoginDate(user['User_ID'])
        // const companyDetails = await getUserCompany(user['User_ID'])
        const jwtToken = createJwt(user)
        user['role'] = 'admin'
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

//change the last login date
function changeLastLoginDate(user_id) {
  return executeQuery({
    query: `UPDATE User_Master SET LastLoginDate = CURRENT_TIMESTAMP WHERE User_ID = ?`,
    values: [user_id]
  })
}

// get company details from Company_User with UserID
function getUserCompany(user_id) {
  return executeQuery({
    query: `SELECT cu.Company_User_ID, cu.Co_ID, cu.Div_ID, cu.Role_ID, cu.status FROM Company_User cu JOIN Company_Master WHERE User_ID = ? AND cu.status = ?`,
    values: [user_id , 50]
  })
}
