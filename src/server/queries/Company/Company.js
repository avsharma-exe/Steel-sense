import executeQuery from '../../../server/Connection'

const Company = {
  getUserCompanyMap,
  getUserCompany
}

/**
 * Get Mapping details from Company_User with User_ID
 * @param {*} user_id
 * @returns database data
 */
function getUserCompanyMap(user_id) {
  return executeQuery({
    query: `SELECT Company_User_ID, Co_ID, Div_ID, Role_ID, status FROM Company_User WHERE User_ID = ? AND status = ?`,
    values: [user_id, 50]
  })
}

/**
 * get company details from Company_Master with Co_ID
 * @param {*} co_id
 * @returns database data
 */
function getUserCompany(co_id) {
  return executeQuery({
    query: `SELECT Co_ID, CompanyName FROM Company_Master WHERE Co_ID = ? AND status = ?`,
    values: [co_id, 50]
  })
}

// TODO: write other company related apis.

export default Company
