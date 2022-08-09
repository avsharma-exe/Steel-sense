import executeQuery from '../../../../server/Connection'

const Read = {
  getInwards
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



export default Read
