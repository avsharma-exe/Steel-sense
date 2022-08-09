import executeQuery from '../../../../server/Connection'

const Read = {
  getAllIndentsOfACompany,
  getAllIndentsOfACompanyDivision,
  getIndentParticulars,
  getIndentByID,
  getPurchaseOrder,
  getAllIndentsOfACompanyByDiv
}

/**
 *
 * @param {*} co_id
 * @returns database data from Product_Stock_Indent table
 */
function getAllIndentsOfACompanyByDiv(co_id , divisions) {
  return executeQuery({
    query: `Select dm.DivisionName, psip.P_Stock_Indent_Particulars_ID as indent_particulars_id, 
    psip.P_Stock_Indent_ID as indent_id, psip.P_ID, psip.Quantity, psip.Description, 
    psip.CurrentStatus, psip.ExpectedDate, psip.CreatedDT, psi.Div_ID, psi.CreatedBy, pst.CurrentStock, pm.PName
    from Product_Stock_Indent psi
    Left Join Product_Stock_Indent_Particulars psip on psip.P_Stock_Indent_ID = psi.P_Stock_Indent_ID
    Left Join Product_Master pm on pm.P_ID = psip.P_ID
    Left Join Division_Master dm on dm.Div_ID = psi.Div_ID 
    Left Join Product_Stock pst on pst.P_ID = psip.P_ID AND pst.Div_ID = psi.Div_ID
    Where psi.Div_ID in (?) and psi.Co_ID = ? and psip.CurrentStatus in (0,50)`,
    values: [divisions , co_id]
  })
}


/**
 *
 * @param {*} co_id
 * @returns database data from Product_Stock_Indent table
 */
 function getAllIndentsOfACompany(co_id) {
  return executeQuery({
    query: `Select dm.DivisionName, psip.P_Stock_Indent_Particulars_ID as indent_particulars_id, psip.P_Stock_Indent_ID as indent_id, psip.P_ID, psip.Quantity, psip.Description, psip.CurrentStatus, psip.ExpectedDate, psip.CreatedDT, psi.Div_ID, psi.CreatedBy, pst.CurrentStock, pm.PName, dm.DivisionName
    from Product_Stock_Indent_Particulars psip
    LEFT JOIN Product_Stock_Indent psi on psip.P_Stock_Indent_ID = psi.P_Stock_Indent_ID
    LEFT JOIN Product_Stock pst on psip.P_ID = pst.P_ID
    LEFT JOIN Product_Master pm on psip.P_ID = pm.P_ID
    LEFT JOIN Division_Master dm on psi.Div_ID = dm.Div_ID

    AND psi.Co_ID = ? Where psip.currentStatus in (0 , 50)`,
    values: [co_id ]
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


function getPurchaseOrder(company_id , div_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock_Inward_Voucher
    left join Product_Master on Product_Master.P_ID = Product_Stock_Inward_Voucher.P_ID
    left join Product_Stock_Inward on Product_Stock_Inward.P_Stock_In_Voucher_ID = Product_Stock_Inward_Voucher.P_Stock_In_Voucher_ID
    left join Company_Master on Product_Stock_Inward_Voucher.Supplier_ID = Company_Master.Co_ID
    where Product_Stock_Inward_Voucher.Co_ID = ? and Product_Stock_Inward_Voucher.Div_ID = ? and Product_Stock_Inward.status <> 50`,
    values: [company_id , div_id]
  })
}

export default Read
