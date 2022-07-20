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
    cryptPassword(body.FirstName + '@' + String(mobile).substr(mobile.length - 4), async (err, hash) => {
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
      allDivisions.forEach( async div_id => {
        console.log(div_id)
        let tempOtherDetails = otherDetails
        tempOtherDetails["Div_ID"] = div_id  
        console.log("inserting ---------- " , tempOtherDetails)
        let other_details = await User.Create.createCompanyUserMap(tempOtherDetails)
        console.log(other_details)
      });
      
     

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
