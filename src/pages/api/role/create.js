import Role from '../../../server/queries/Role/Role'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  try {
    const privilegeDetails = body.details
    delete body.details
    let privilege_details = []

    // add new user to UserMaster
    let result = await Role.Create.createNewRole(body)
    privilegeDetails.forEach(element => {
      element['Role_ID'] = result.insertId
      privilege_details.push(await Role.Create.createRolePrivilege(element));
    })

    if (result && privilege_details) {
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
