import User from '../../../server/queries/User/User'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
      const companyUserDetails = body
      const Company_User_ID = body.Company_User_ID
      delete companyUserDetails.Company_User_ID

      // console.log(companyUserDetails)
      // Update User details in COmpnay_User
      let result = await User.Update.updateCompanyUser(companyUserDetails,Company_User_ID)

      if (result) {
        res.send({
          error: false,
          msg: 'Compnay User updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
