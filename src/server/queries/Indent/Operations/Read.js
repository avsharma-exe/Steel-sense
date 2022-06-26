import executeQuery from '../../../../server/Connection'

const Read = {
  getAllIndentsOfACompany,
  getAllIndentsOfACompanyDivision,
  getIndentParticulars
}

/**
 * 
 * @param {*} co_id 
 * @returns database data from Product_Stock_Indent table
 */
function getAllIndentsOfACompany(co_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock_Indent WHERE Co_ID = ?`,
    values: [co_id]
  })
}

/**
 * 
 * @param {*} co_id 
 * @param {*} div_id 
 * @returns database data from Product_Stock_Indent table
 */
function getAllIndentsOfACompanyDivision(co_id, div_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock_Indent WHERE Co_ID = ? AND Div_ID = ?`,
    values: [co_id, div_id]
  })
}

/**
 * 
 * @param {*} indent_id
 * @returns database data from Product_Stock_Indent table
 */
function getIndentParticulars(indent_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock_Indent_Particulars WHERE P_Stock_Indent_ID = ?`,
    values: [indent_id]
  })
}

export default Read
