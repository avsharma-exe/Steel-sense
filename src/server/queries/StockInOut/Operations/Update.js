import executeQuery from '../../../../server/Connection'

const Update = {
  updateStockInward,
  updateProductStockInwardVoucher,
  updateProductStockInwardStatus

}

/**
 * insert product in Product_Master
 * @param {*} body
 * @returns db object
 */

function updateStockInward(quantity, p_id) {
  return executeQuery({
    query: 'UPDATE Product_Stock SET LastStock = CurrentStock, CurrentStock = CurrentStock + ? WHERE P_ID = ?;',
    values: [quantity,p_id]
  })
}

function updateProductStockInwardVoucher(body, voucher_id) {
  return executeQuery({
    query: 'UPDATE Product_Stock_Inward_Voucher SET ? WHERE P_Stock_In_Voucher_ID = ?',
    values: [body, voucher_id]
  })
}

function updateProductStockInwardStatus(status, inward_id) {
  return executeQuery({
    query: 'UPDATE Product_Stock_Inward SET status = ? WHERE P_Stock_In_ID = ?',
    values: [status, inward_id]
  })
}


export default Update
