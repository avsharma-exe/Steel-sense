import executeQuery from '../../../../server/Connection'

const Update = {
  updateCompanyDivision
}

/**
 * Updates the specified role
 * @param {*} body 
 * @param {*} companyID 
 * @returns 
 */
function updateCompanyDivision(body) {
  return executeQuery({
    query: 'UPDATE Division_Master SET ? WHERE Co_ID = ? AND Div_ID = ?',
    values: [body, body['Co_ID'], body['Div_ID']]
  })
}

export default Update
