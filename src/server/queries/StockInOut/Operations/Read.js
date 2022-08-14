import executeQuery from '../../../../server/Connection'

const Read = {
  getInwards,
  getBillEntries,
  getBillDetails
}

function getInwards(co_id) {
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

function getBillEntries(co_id) {
  return executeQuery({
    query: `SELECT *,Product_Stock_Inward_Voucher.Co_ID as company FROM Product_Stock_Inward_Voucher 
            join Product_Stock_Inward on Product_Stock_Inward.P_Stock_In_Voucher_ID = Product_Stock_Inward_Voucher.P_Stock_In_Voucher_ID
            join Company_Master on Company_Master.Co_ID = Product_Stock_Inward_Voucher.Supplier_ID
            join Product_Master on Product_Master.P_ID = Product_Stock_Inward_Voucher.P_ID
            join Product_Price_Details on Product_Price_Details.P_ID = Product_Stock_Inward_Voucher.P_ID

            where Product_Stock_Inward_Voucher.Co_ID = ? AND Product_Stock_Inward.status = 50`,
    values: [co_id]
  })
}

function getBillDetails(inward) {
  return executeQuery({
    query: `SELECT *,states.name as state_name , cities.name as city_name, countries.name as country_name FROM Product_Stock_Inward_Voucher
            join Company_Master on Company_Master.Co_ID = Product_Stock_Inward_Voucher.Supplier_ID
            join Company_Details on Company_Details.Co_ID = Company_Master.Co_ID
            join states on Company_Details.State = states.id
            join cities on Company_Details.City = cities.id
            join countries on Company_Details.Country = countries.id
            join Product_Master on Product_Stock_Inward_Voucher.P_ID = Product_Master.P_ID
            join Product_Price_Details on Product_Price_Details.P_ID = Product_Master.P_ID
            join Product_Stock_Inward on Product_Stock_Inward.P_Stock_In_Voucher_ID = Product_Stock_Inward_Voucher.P_Stock_In_Voucher_ID
            where Product_Stock_Inward_Voucher.P_Stock_In_Voucher_ID = ?`,
    values: [inward]
  })
}

export default Read
