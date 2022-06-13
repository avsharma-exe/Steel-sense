import Role from '../../../server/queries/Role/Role'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  try {
    let privilegeDetails,
      privilege_details = []
    if (body.details) {
      privilegeDetails = body.details
      delete body.details
    }
    let date = new Date()
    // 2021-07-02 23:29:08.000000
    body['CreatedDT'] =
      date.getFullYear() +
      '-' +
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()

    // add new user to UserMaster
    let result = await Role.Create.createNewRole(body)
    if (privilegeDetails && privilegeDetails.length) {
      privilegeDetails.forEach(async element => {
        element['Role_ID'] = result.insertId
        privilege_details.push(await Role.Create.createRolePrivilege(element))
      })
    }

    if (result) {
      res.send({
        error: false,
        msg: 'Company added successfully',
        result,
        privilege_details
      })
    }
  } catch (e) {
    throw e
  }
}
