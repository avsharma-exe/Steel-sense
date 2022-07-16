import executeQuery from '../../../../server/Connection'

const Read = {
  getAllIndentsOfACompany,
  getAllIndentsOfACompanyDivision,
  getIndentParticulars,
  getIndentByID
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

// /**
//  * 
//  * @param {*} co_id 
//  * @param {*} div_id 
//  * @returns database data from Product_Stock_Indent table
//  */
// function getAllIndentsOfACompanyDivision(co_id, div_id) {
//   return executeQuery({
//     query: `SELECT * FROM Product_Stock_Indent WHERE Co_ID = ? AND Div_ID = ?`,
//     values: [co_id, div_id]
//   })
// }

/**
 * 
 * @param {*} co_id 
 * @param {*} div_id 
 * @returns database data from Product_Stock_Indent table
 */
function getAllIndentsOfACompanyDivision(co_id, div_id) {
  return executeQuery({
    query: `SELECT psi.P_Stock_Indent_ID, psi.Co_ID, psi.Div_ID, psi.IndentNo, psip.P_Stock_Indent_Particulars_ID, psip.P_ID, psip.Quantity, psip.Description, psip.Remarks, psip.CurrentStatus, psip.ExpectedDate,pm.PName FROM Product_Stock_Indent psi LEFT JOIN Product_Stock_Indent_Particulars psip on psi.P_Stock_Indent_ID = psip.P_Stock_Indent_ID LEFT JOIN Product_Master pm on pm.P_ID = psip.P_ID where Co_ID=? and Div_ID=?`,
    values: [co_id, div_id]
  })
}

/**
 * 
 * @param {*} co_id 
 * @returns database data from Product_Stock_Indent table
 */
 function getIndentByID(id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock_Indent WHERE P_Stock_Indent_ID = ?`,
    values: [id]
  })
}

/**
 * 
 * @param {*} indent_id
 * @returns database data from Product_Stock_Indent table
 */
function getIndentParticulars(indent_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock_Indent_Particulars join Product_Master on Product_Master.P_ID = Product_Stock_Indent_Particulars.P_ID WHERE P_Stock_Indent_ID = ?`,
    values: [indent_id]
  })
}

export default Read
