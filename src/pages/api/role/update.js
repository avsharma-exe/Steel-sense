import Role from '../../../server/queries/Role/Role'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
      const roleDetails = body
      let date = new Date()
      // 2021-07-02 23:29:08.000000
      roleDetails['UpdatedDT'] = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()

      // add new user to UserMaster
      let result = await Role.Update.updateCompanyRole(roleDetails)

      if (result) {
        res.send({
          error: false,
          msg: 'Role updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
