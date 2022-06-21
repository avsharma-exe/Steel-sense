import executeQuery from '../../../../server/Connection'

const Read = {
  getAllProductsIDsOfACompany,
  getProductMasterData,
  getProductPriceDetailsData,
  getProductUnitData,
  getProductStockData,
  getProductGSTData,
  getProductOtherData,
}

/**
 * Fetches all the IDs of all products under a company and division
 * @param {*} co_id 
 * @param {*} div_id 
 * @returns database data from Product_Company_Division table
 */
function getAllProductsIDsOfACompany(co_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Company_Division WHERE Co_ID = ?`,
    values: [co_id]
  })
}

/**
 * Fetches All the product details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_Master table
 */
function getProductMasterData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Master WHERE P_ID = ?`,
    values: [p_id]
  })
}

/**
 * Fetches All the product price details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_Price_Details table
 */
function getProductPriceDetailsData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Price_Details WHERE P_ID = ?`,
    values: [p_id]
  })
}

/**
 * Fetches All the product units details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_Unit table
 */
function getProductUnitData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Unit WHERE P_ID = ?`,
    values: [p_id]
  })
}

/**
 * Fetches All the product stock details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_Stock table
 */
function getProductStockData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock WHERE P_ID = ?`,
    values: [p_id]
  })
}

/**
 * Fetches All the product GST details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_GST_Details table
 */
function getProductGSTData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_GST_Details WHERE P_ID = ?`,
    values: [p_id]
  })
}

/**
 * Fetches All the product Other details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_Other_Details table
 */
function getProductOtherData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Other_Details WHERE P_ID = ?`,
    values: [p_id]
  })
}

/**
 * Fetches All the product Description details for a given product id
 * @param {*} p_id 
 * @returns database data from Product_Description table
 */
function getProductDescriptionData(p_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Description WHERE P_ID = ?`,
    values: [p_id]
  })
}

export default Read
