import executeQuery from '../../../../server/Connection'

const Read = {
  getAllDivisionsOfACompany,
  getDivisionData
}

/**
 * Get All divisions that lie under a company
 * @param {*} co_id
 * @returns database data
 */
function getAllDivisionsOfACompany(co_id) {
  return executeQuery({
    query: `SELECT * FROM Division_Master WHERE Co_ID = ? AND status = ?`,
    values: [co_id, 50]
  })
}

/**
 * Get A particular division data usinf Div_ID
 * @param {*} div_id
 * @returns database data
 */
function getDivisionData(div_id) {
  return executeQuery({
    query: `SELECT * FROM Division_Master WHERE Div_ID = ? AND status = ?`,
    values: [div_id, 50]
  })
}

export default Read
