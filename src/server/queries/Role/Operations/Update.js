import executeQuery from '../../../../server/Connection'

const Update = {
  updateCompanyRole
}

/**
 * Updates the specified role
 * @param {*} body 
 * @param {*} companyID 
 * @returns 
 */
function updateCompanyRole(body) {
  return executeQuery({
    query: 'UPDATE User_Roles SET ? WHERE Co_ID = ? AND Role_ID = ?',
    values: [body, body['Co_ID'], body['Role_ID']]
  })
}

export default Update
