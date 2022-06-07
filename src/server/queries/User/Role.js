import executeQuery from '../../../server/Connection'

const Role = {
    getUserRole,
    getUserRolePriviledge,
    getUserAppPages
}

/**
 * Get the user role using role_id
 * @param {*} role_id 
 * @returns db data
 */
function getUserRole(role_id) {
  return executeQuery({
    query:
      'SELECT RoleName, RoleDescription FROM User_Roles where Role_ID = ?',
    values: [role_id]
  })
}

/**
 * fetches the role priviledges
 * @param {*} role_id 
 * @returns db data
 */
function getUserRolePriviledge(role_id) {
  return executeQuery({
    query:
      'SELECT Role_Priviledge_ID, Page_ID FROM Role_Priviledge where Role_ID = ?',
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
    query:
      'SELECT Page_ID, PageName FROM App_Pages where Page_ID = ?',
    values: [page_id]
  })
}

export default Role;
