import executeQuery from '../../../../server/Connection'

const Create = {
  createNewIndent,
  createNewIndentParticulars,
  productStockInwardVoucher,
  productStockInward
}

/**
 * insert product in Product_Stock_Indent
 * @param {*} body
 * @returns db object
 */
function createNewIndent(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Indent SET ?',
    values: body
  })
}

/**
 * insert data to Product_Stock_Inward_Voucher
 */
function productStockInwardVoucher(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Inward_Voucher SET ?',
    values: body
  })
}

/**
 * insert data to Product_Stock_Inward
 */
 function productStockInward(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Inward SET ?',
    values: body
  })
}

/**
 * insert product in Product_Stock_Indent_Particulars
 * @param {*} body
 * @returns db object
 */
function createNewIndentParticulars(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Indent_Particulars SET ?',
    values: body
  })
}

export default Create