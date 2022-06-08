import executeQuery from '../../../../server/Connection'

const Create = {
  createNewUser,
  createCompanyUserMap
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
function createCompanyUserMap(body) {
  return executeQuery({
    query: 'INSERT INTO Company_User SET ?',
    values: body
  })
}

export default Create
