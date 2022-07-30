import executeQuery from '../../../../server/Connection'

const Create = {
  createNewProduct,
  createProductPriceDetails,
  createProductUnitDetails,
  createProductStockDetails,
  createProductGSTDetails,
  createProductOtherDetails,
  createProductDescription,
  createProductCompanyDivision
}

/**
 * insert product in Product_Master
 * @param {*} body
 * @returns db object
 */
function createNewProduct(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Master SET ?',
    values: body
  })
}

/**
 * insert Product Price details
 * @param {*} body
 * @returns db object
 */
function createProductPriceDetails(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Price_Details SET ?',
    values: body
  })
}

/**
 * insert product unit details
 * @param {*} body
 * @returns db object
 */
function createProductUnitDetails(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Unit SET ?',
    values: body
  })
}

/**
 * insert product stock details
 * @param {*} body
 * @returns db object
 */
function createProductStockDetails(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Stock SET ?',
    values: body
  })
}

/**
 * insert product gst details
 * @param {*} body
 * @returns db object
 */
function createProductGSTDetails(body) {
  return executeQuery({
    query: 'INSERT INTO Product_GST_Details SET ?',
    values: body
  })
}

/**
 * insert product other details
 * @param {*} body
 * @returns db object
 */
function createProductOtherDetails(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Other_Details SET ?',
    values: body
  })
}

/**
 * insert product description
 * @param {*} body
 * @returns db object
 */
function createProductDescription(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Description SET ?',
    values: body
  })
}

/**
 * insert product company division
 * @param {*} body
 * @returns db object
 */
function createProductCompanyDivision(body) {
  return executeQuery({
    query: 'INSERT INTO Product_Company_Division SET ?',
    values: body
  })
}

export default Create
