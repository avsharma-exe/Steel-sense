import { cryptPassword } from '../../../helpers/encrypt'
import User from '../../../server/queries/User/User'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  let mobile = body.MobileNo

  // console.log(body)
  try {
    let pass = body.FirstName + '@' + String(mobile).slice(-4)
    cryptPassword(pass, async (err, hash) => {
      if (err) throw err
      body.Password = hash
      const otherDetails = body.otherDetails
      delete body.otherDetails
      otherDetails["status"] = 50

      // add new user to UserMaster
      let result = await User.Create.createNewUser(body)
      otherDetails['User_ID'] = result.insertId
      let allDivisions = otherDetails["divisions"]
      delete otherDetails["divisions"]
      console.log(allDivisions)

      for( let division of allDivisions ) {
        console.log(division)
        let tempOtherDetails = otherDetails
        tempOtherDetails["Div_ID"] = division
        console.log("inserting ---------- " , tempOtherDetails)
        let other_details = await User.Create.createCompanyUserMap(tempOtherDetails)
      }

      if (result) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'User added successfully',
          result,
        })
      }
    })
  } catch (e) {
    throw e
  }
}
