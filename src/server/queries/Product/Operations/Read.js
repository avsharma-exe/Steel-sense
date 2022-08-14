import executeQuery from '../../../../server/Connection'

const Read = {
  getAllProductsIDsOfACompany,
  getProductMasterData,
  getProductPriceDetailsData,
  getProductUnitData,
  getProductStockData,
  getProductGSTData,
  getProductOtherData,
  getProductAllDetails,
  getLowStockProducts,
  getAllDivsionProducts,
  getAllProductsIDsOfACompanyByDivision
}

/**
 * get all product details query
 * @param {*}
 * @returns database data for all products
 */
function getAllProducts(co_id) {

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

function getAllProductsIDsOfACompanyByDivision(co_id , divisions) {
  return executeQuery({
    query: `SELECT * FROM Product_Company_Division WHERE Co_ID = ? AND Div_ID IN (?)`,
    values: [co_id , divisions]
  })
}

function getAllDivsionProducts(co_id,divisions) {
  return executeQuery({
    query: `SELECT c.*, s.* FROM Product_Master c
            LEFT JOIN Product_Company_Division p ON c.P_ID=p.P_ID
            LEFT JOIN Product_Stock s ON c.P_ID=s.P_ID
            WHERE p.Co_ID = ? AND p.Div_ID IN (?)`,
    values: [co_id,divisions]
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
function getProductStockData(p_id,div_id) {
  return executeQuery({
    query: `SELECT * FROM Product_Stock join Division_Master on Division_Master.Div_ID = Product_Stock.Div_ID WHERE P_ID = ? AND Product_Stock.Div_ID = ?`,
    values: [p_id, div_id]
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

/**
 *
 * @param {*} p_id
 * @returns database data from ProductMaster , ProductGSTDetails, ProductStockDetails, ProductOtherDetails
 */
function getProductAllDetails(p_id) {
  return executeQuery({
    query: "SELECT * FROM Product_Master join Product_Price_Details on Product_Price_Details.P_ID = Product_Master.P_ID join Product_GST_Details on Product_GST_Details.P_ID = Product_Master.P_ID join Product_Stock on Product_Stock.P_ID = Product_Master.P_ID where Product_Master.P_ID = ?",
    values: [p_id]
  })
}

/**
 *
 * @param {*} co_id
 * @returns database data from ProductMaster
 */
function getLowStockProducts(co_id, divisions) {
  console.log(divisions)
  return executeQuery({
    query: `Select ps.P_ID, ps.CurrentStock, ps.LastStock, ps.LowStockLimit, ps.MaxStockLimit, ps.Div_ID
            from Product_Stock ps
            LEFT JOIN Product_Company_Division pcd on ps.P_ID = pcd.P_ID  and pcd.Div_ID = ps.Div_ID
            where ps.LowStockLimit >= ps.CurrentStock
            AND pcd.Co_ID = ?
            AND pcd.Div_ID IN (?)
            AND ps.P_ID NOT IN (Select Product_Stock_Indent_Particulars.P_ID from Product_Stock_Indent 
            join Product_Stock_Indent_Particulars on Product_Stock_Indent_Particulars.P_Stock_Indent_ID = Product_Stock_Indent.P_Stock_Indent_ID
            where Product_Stock_Indent.Div_ID IN (?) AND Product_Stock_Indent_Particulars.CurrentStatus IN (0 , 50, 199) )`,
    values: [co_id, divisions, divisions]
  })
}

export default Read
