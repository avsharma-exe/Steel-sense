import executeQuery from '../../../../server/Connection'

const Read = {
  getUserDetails,
  getAllCompanyUsers,
  getUserByID,
}

/**
 * fetch user details for logging in
 * @param {*} email
 * @returns user login details
 */
function getUserDetails(email) {
  return executeQuery({
    query: 'SELECT User_Master.User_ID, User_Master.Email, User_Master.Password, User_Master.FirstName, User_Master.LastName, User_Master.MobileNo, User_Master.LastLoginDate, Company_User.Co_ID, Company_User.Div_ID, Company_User.Role_ID, Company_User.status, cm.status FROM User_Master LEFT JOIN Company_User ON Company_User.User_ID = User_Master.User_ID LEFT JOIN Company_Master cm on cm.Co_ID = Company_User.Co_ID where Email = ? AND Company_User.status = ? AND cm.status = ?',
    values: [email, 50, 50]
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
