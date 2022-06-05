import executeQuery from '../../server/Connection'
import { cryptPassword } from '../../helpers/encrypt'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  let mobile = body.MobileNo
  try {
    cryptPassword(body.FirstName + '@' + mobile.substr(mobile.length - 4), async (err, hash) => {
      if (err) throw err
      body.Password = hash

      // add new user to UserMaster
      let result = await executeQuery({
        query: 'INSERT INTO User_Master SET ?',
        values: body
      })

      if (result) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          msg: 'User added successfully',
          result
        })
      }
    })
  } catch (e) {
    throw e
  }
}
