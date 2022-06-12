import executeQuery from '../../../../server/Connection'

const Update = {
  updateCompany,
  updateCompanyDetails
}

/**
 * Inserts a New Company to Company_Master
 * @param {*} body
 * @returns Database insertion object to get the InsertId of the company
 */
function updateCompany(body) {
  body.UpdatedDT = Date.now().toISOString().slice(0, 19).replace('T', ' ');;
  return executeQuery({
    query: 'UPDATE Company_Master SET ? WHERE Co_ID = ?',
    values: [body,companyID]
  })
}

/**
 * Inserts a Company Details to Company_Details
 * @param {*} body
 * @returns Database insertion object to get the InsertId of the company
 */
function updateCompanyDetails(body, companyID) {
  body.UpdatedDT = Date.now().toISOString().slice(0, 19).replace('T', ' ');;
  return executeQuery({
    query: 'UPDATE Company_Details SET ? WHERE Co_ID = ?',
    values: [body,companyID]
  })
}

export default Update
