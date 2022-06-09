import executeQuery from '../../../../server/Connection'

const Read = {
  getUserRole,
  getUserRolePrivilege,
  getUserAppPages,
  getAllRolesOfACompany,
  getAllPrivilegesOfARole,
  getAllAppPages
}

/**
 * Get the user role using role_id
 * @param {*} role_id
 * @returns db data
 */
function getUserRole(role_id) {
  return executeQuery({
    query: 'SELECT RoleName, RoleDescription FROM User_Roles where Role_ID = ?',
    values: [role_id]
  })
}

/**
 * fetches the role privileges
 * @param {*} role_id
 * @returns db data
 */
function getUserRolePrivilege(role_id) {
  return executeQuery({
    query: 'SELECT * FROM Role_Privilege where Role_ID = ?',
    values: [role_id]
  })
}

/**
 * gets all the accessible app pages to the user
 * @param {*} page_id
 * @returns db data
 */
function getUserAppPages(page_id) {
  return executeQuery({
    query: 'SELECT Page_ID, PageName FROM App_Pages where Page_ID = ?',
    values: [page_id]
  })
}

/**
 * gets all the app pages in the system
 * @returns db data
 */
function getAllAppPages() {
  return executeQuery({
    query: 'SELECT * FROM App_Pages',
    values: []
  })
}

/**
 * gets all the roles under a company
 * @param {*} co_id
 * @returns db data
 */
function getAllRolesOfACompany(co_id) {
  return executeQuery({
    query: 'SELECT * FROM User_Roles where Co_ID = ?',
    values: [co_id]
  })
}

/**
 * gets all the roles under a company
 * @param {*} co_id
 * @returns db data
 */
function getAllPrivilegesOfARole(role_id, co_id) {
  return executeQuery({
    query: 'SELECT * FROM Role_Privilege where Role_ID = ? AND Co_ID = ?',
    values: [role_id, co_id]
  })
}

export default Read
