import executeQuery from '../../../../server/Connection'

const Read = {
  getUserCompanyMap,
  getUserCompany: getCompanyMasterData,
  getCompanyMasterData,
  getCompanyDetailsData,
  getAllCompanies,
  getAllSuppliers
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
 * @param company ID
 * @returns database data
 */
function getAllSuppliers(Co_ID) {
  return executeQuery({
    query:
      'SELECT * from Company_Master join User_Master on Company_Master.CreatedBy = User_Master.User_ID join Company_User on Company_User.User_ID =  User_Master.User_ID join Company_Details on Company_Details.Co_ID = Company_Master.Co_ID where Company_Details.CompanyType = ? and Company_User.Co_ID = ?',
    values: ['Supplier', Co_ID]
  })
}

/**
 * @param
 * @returns database data
 */
function getAllCompanies() {
  return executeQuery({
    query: 'SELECT * from Company_Master join User_Master on Company_Master.CreatedBy = User_Master.User_ID',
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
    query: `SELECT *, cities.name as city_name , countries.name as country_name , states.name as state_name FROM Company_Details 
    join Company_Master on Company_Master.Co_ID = Company_Details.Co_ID
    LEFT JOIN states on Company_Details.State = states.id
    LEFT JOIN cities on Company_Details.City = cities.id
    LEFT JOIN countries on Company_Details.Country = countries.id
    WHERE Company_Master.Co_ID = ?`,
    values: [co_id]
  })
}

export default Read
