import executeQuery from '../../../../server/Connection'

const Create = {
  createNewRole,
  createRolePrivilege
}

/**
 * insert role
 * @param {*} body
 * @returns db object
 */
function createNewRole(body) {
  return executeQuery({
    query: 'INSERT INTO User_Roles SET ?',
    values: body
  })
}

/**
 * insert role privilege
 * @param {*} body
 * @returns db object
 */
function createRolePrivilege(body) {
  return executeQuery({
    query: 'INSERT INTO Role_Privilege SET ?',
    values: body
  })
}

export default Create
