import executeQuery from '../../../../server/Connection'

const Create = {
  createNewBillEntry,
}

/**
 * Inserts a New Company to Company_Master
 * @param {*} body
 * @returns Database insertion object to get the InsertId of the company
 */
function createNewBillEntry(body) {
  return executeQuery({
    query: 'INSERT INTO Bill_Entries SET ?',
    values: body
  })
}

export default Create
