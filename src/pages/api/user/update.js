import { cryptPassword } from '../../../helpers/encrypt'
import User from '../../../server/queries/User/User'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  let mobile = body.MobileNo
  let User_ID = body.User_ID
  // TODO if L1 is updating L2 then his id should be here
  body['UpdatedBy'] = body.User_ID
  try {
    cryptPassword(body.FirstName + '@' + mobile.substr(mobile.length - 4), async (err, hash) => {
      if (err) throw err
      let date = new Date()
      body.Password = hash
      body['UpdatedDT'] = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      delete body.User_ID
      console.log(body, "aaaaaaaaaaaaaaaaaaaa")
      // update user in UserMaster
      let result = await User.Update.updateUserDetails(body,User_ID)

      if (result) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'User updated successfully',
          result
        })
      }
    })
  } catch (e) {
    throw e
  }
}
