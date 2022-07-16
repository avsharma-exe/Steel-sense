import executeQuery from '../../../../server/Connection'

const Update = {
  updateStockInward,
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

function createStockInwardVoucher(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Inward_Voucher SET ?',
    values: body
  })
}

export default Update
