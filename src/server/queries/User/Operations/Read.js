import executeQuery from '../../../../server/Connection'

const Read = {
  getUserDetails,
  getAllCompanyUsers,
  getUserByID
}

/**
 * fetch user details for logging in
 * @param {*} email
 * @returns user login details
 */
function getUserDetails(email) {
  return executeQuery({
    query: 'SELECT * FROM User_Master where Email = ?',
    values: [email]
  })
}

/**
 * Fetch IDs of all users under a company
 * @param {*} co_id
 * @returns database entries of all users under a company
 */
function getAllCompanyUsers(co_id) {
  return executeQuery({
    query: 'SELECT * FROM Company_User where Co_ID = ?',
    values: [co_id]
  })
}

/**
 * Fetch data of a user by its ID
 * @param {*} user_id
 * @returns database entry of a user
 */
function getUserByID(user_id) {
  return executeQuery({
    query: 'SELECT User_ID, FirstName, LastName, Email, MobileNo, LastLoginDate FROM User_Master where User_ID = ?',
    values: [user_id]
  })
}

export default Read
