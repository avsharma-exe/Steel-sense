import executeQuery from '../../../../server/Connection'

const Read = {
  getUserCompanyMap,
  getUserCompany: getCompanyMasterData,
  getCompanyMasterData,
  getCompanyDetailsData,
  getAllCompanies
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
 * 
 * @param 
 * @returns database data
 */
function getAllCompanies() {
  return executeQuery({
    query: "SELECT * from Company_Master join User_Master on Company_Master.CreatedBy = User_Master.User_ID",
    values: []
  })
}

/**
 * get company details from Company_Master for Co_ID
 * @param {*} co_id
 * @returns database data
 */
function getCompanyMasterData(co_id) {
  return executeQuery({
    query: `SELECT * FROM Company_Master WHERE Co_ID = ? AND status = ?`,
    values: [co_id, 50]
  })
}

/**
 * get company details from Company_Details for Co_ID
 * @param {*} co_id
 * @returns database data
 */
function getCompanyDetailsData(co_id) {
  return executeQuery({
    query: `SELECT * FROM Company_Details WHERE Co_ID = ?`,
    values: [co_id]
  })
}


export default Read
