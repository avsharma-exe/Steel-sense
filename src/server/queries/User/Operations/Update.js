import executeQuery from '../../../../server/Connection'

const Update = {
  changeLastLoginDate
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

// TODO: Implement other updation queries

export default Update
