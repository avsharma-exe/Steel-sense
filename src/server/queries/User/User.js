import executeQuery from '../../../server/Connection'

const User = {
  getUserDetails,
  changeLastLoginDate,
  createNewUser,
  insertCompanyUserMap
}

/**
 * fetch user details for logging in
 * @param {*} email 
 * @returns user login details
 */
function getUserDetails(email) {
  return executeQuery({
    query:
      'SELECT User_ID, Username, FirstName, Password, LastName, Email, MobileNo, LastLoginDate FROM User_Master where Email = ?',
    values: [email]
  })
}

/**
 * change the last login date
 * @param {*} user_id
 * @returns db object
 */
function changeLastLoginDate(user_id) {
  return executeQuery({
    query: `UPDATE User_Master SET LastLoginDate = CURRENT_TIMESTAMP WHERE User_ID = ?`,
    values: [user_id]
  })
}

/**
 * insert user
 * @param {*} body
 * @returns db object
 */
function createNewUser(body) {
  return executeQuery({
    query: 'INSERT INTO User_Master SET ?',
    values: body
  })
}

/**
 * insert user company map
 * @param {*} body
 * @returns db object
 */
function insertCompanyUserMap(body) {
  return executeQuery({
    query: 'INSERT INTO Company_User SET ?',
    values: body
  })
}
export default User
