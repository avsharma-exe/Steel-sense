import executeQuery from '../../../../server/Connection'

const Update = {
  updateProductMaster,
  updatePriceDetails,
  updateStockDetails,
  updateGSTDetails
}


function updateProductMaster(body,product_ID) {
  return executeQuery({
    query: `UPDATE Product_Master SET ? WHERE P_ID = ?`,
    values: [body,product_ID]
  })
}

function updatePriceDetails(body,product_ID) {
  return executeQuery({
    query: `UPDATE Product_Price_Details SET ? WHERE P_ID = ?`,
    values: [body,product_ID]
  })
}

function updateStockDetails(body,product_ID) {
  return executeQuery({
    query: `UPDATE Product_Stock SET ? WHERE P_ID = ?`,
    values: [body,product_ID]
  })
}

function updateGSTDetails(body,product_ID) {
  return executeQuery({
    query: `UPDATE Product_GST_Details SET ? WHERE P_ID = ?`,
    values: [body,product_ID]
  })
}

// TODO: Implement other updation queries

export default Update
