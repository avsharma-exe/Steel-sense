import executeQuery from '../../../../server/Connection'

const Create = {
  createStockInward,
  createStockInwardVoucher,
}

/**
 * insert product in Product_Master
 * @param {*} body
 * @returns db object
 */

function createStockInward(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Inward SET ?',
    values: body
  })
}

function createStockInwardVoucher(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock_Inward_Voucher SET ?',
    values: body
  })
}

export default Create
