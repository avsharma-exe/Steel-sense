import executeQuery from '../../../../server/Connection'

const Create = {
  createNewCompany,
  createCompanyDetails
}

/**
 * Inserts a New Company to Company_Master
 * @param {*} body
 * @returns Database insertion object to get the InsertId of the company
 */
function createNewCompany(body) {
  return executeQuery({
    query: 'INSERT INTO Company_Master SET ?',
    values: body
  })
}

/**
 * Inserts a Company Details to Company_Details
 * @param {*} body
 * @returns Database insertion object to get the InsertId of the company
 */
function createCompanyDetails(body) {
  return executeQuery({
    query: 'INSERT INTO Company_Details SET ?',
    values: body
  })
}

export default Create
