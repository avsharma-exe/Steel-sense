import executeQuery from '../../../../server/Connection'

const Read = {
  getBillEntries,
  getSingleBillEntry,
  getBillProducts,
  getBillEntryDetails,
  getBillDetails
}


/**
 * Get bill details
 * @param {*} bill_id
 * @returns database data
 */
function getBillDetails(bill_id) {
  return executeQuery({
    query: `SELECT * from Bill_Entry where Bill_Entry_ID = ?`,
    values: [bill_id]
  })
}

/**
 * Get all bill entries for compnay
 * @param {*} company_id
 * @returns database data
 */
function getBillEntries(company) {
  return executeQuery({
    query: `SELECT Supplier_ID, DueOn,SubTotal, Bill_Entry_ID, Bill_Name, Bill_Entries.status, Company_Master.CompanyName, Tax, Discount, Total, InvoiceDate  FROM Bill_Entries JOIN Company_Master ON Bill_Entries.Supplier_ID = Company_Master.Co_ID where Bill_Entries.Co_ID = ?`,
    values: [company]
  })
}

/**
 * Get all single bill entries for compnay
 * @param {*} company_id
 * @returns database data
 */
function getSingleBillEntry(co_id) {
  return executeQuery({
    query: `SELECT psi.P_Stock_In_ID, psi.P_Stock_In_Voucher_ID, psi.UnitPrice, psi.DiscountPercent,
              psi.TaxPercent, psi.TotalAmount, ppd.Unit,
              psiv.Quantity, psiv.InvoiceDate, psiv.Co_ID, psiv.CreatedDT, psiv.Supplier_ID,
              pm.PName, cm.CompanyName, sn.CompanyName as SupplierName
              FROM Product_Stock_Inward psi
              LEFT JOIN Product_Stock_Inward_Voucher psiv on psi.P_Stock_In_Voucher_ID = psiv.P_Stock_In_Voucher_ID
              LEFT JOIN Product_Master pm on psiv.P_ID = pm.P_ID
              LEFT JOIN Company_Master cm on psiv.Co_ID = cm.Co_ID
              LEFT JOIN Company_Master sn on psiv.Supplier_ID = sn.Co_ID
              LEFT JOIN Product_Price_Details ppd on psiv.P_ID = ppd.P_ID
              WHERE psiv.Co_ID = ? AND psi.status = 50`,
    values: co_id
  })
}

/**
 * Get bill entry details
 * @param {*} bill_entry_id
 * @returns database data
 */
function getBillEntryDetails(bill_entry_id) {
  return executeQuery({
    query: `SELECT *, cities.name as city_name , countries.name as country_name , states.name as state_name FROM Bill_Entries
    LEFT JOIN Company_Master ON Company_Master.Co_ID = Bill_Entries.Co_ID
    LEFT JOIN Company_Details ON Company_Master.Co_ID = Company_Details.Co_ID 
    LEFT JOIN states on Company_Details.State = states.id
    LEFT JOIN cities on Company_Details.City = cities.id
    LEFT JOIN countries on Company_Details.Country = countries.id
    where Bill_Entry_ID = ?`,
    values: [bill_entry_id]
  })
}

/**
 * Get bill entry product details from inward
 * @param {*} bill_entry_id
 * @returns database data
 */
function getBillProducts(bill_entry_id) {
  return executeQuery({
    query: `SELECT psi.P_Stock_In_ID, psi.P_Stock_In_Voucher_ID, psi.UnitPrice, psi.DiscountPercent,
        psi.TaxPercent, psi.TotalAmount, ppd.Unit,
        psiv.Quantity, psiv.InvoiceDate, psiv.Co_ID, psiv.CreatedDT, psiv.Supplier_ID,
        pm.PName, cm.CompanyName, sn.CompanyName as SupplierName
        FROM Product_Stock_Inward psi
        LEFT JOIN Product_Stock_Inward_Voucher psiv on psi.P_Stock_In_Voucher_ID = psiv.P_Stock_In_Voucher_ID
        LEFT JOIN Product_Master pm on psiv.P_ID = pm.P_ID
        LEFT JOIN Company_Master cm on psiv.Co_ID = cm.Co_ID
        LEFT JOIN Company_Master sn on psiv.Supplier_ID = sn.Co_ID
        LEFT JOIN Product_Price_Details ppd on psiv.P_ID = ppd.P_ID
        WHERE Bill_Entry_ID = ?`,
    values: [bill_entry_id]
  })
}

export default Read
