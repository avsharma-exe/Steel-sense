import executeQuery from '../../../../server/Connection'

const Create = {
  createNewDivision
}

/**
 * Inserts a New Division to Division_Master under a company
 * @param {*} body
 * @returns Database insertion object to get the InsertId of the Division
 */
function createNewDivision(body) {
  return executeQuery({
    query: 'INSERT INTO Division_Master SET ?',
    values: body
  })
}

export default Create
