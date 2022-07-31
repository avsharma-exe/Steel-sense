import executeQuery from '../../../../server/Connection'

const Read = {
  getInwards
}


function getInwards(co_id) {
  return executeQuery({
    query: `SELECT psi.*, psiv.Quantity, psiv.InvoiceDate, pm.PName, cm.CompanyName, psiv.Co_ID
    FROM Product_Stock_Inward psi
    LEFT JOIN Product_Stock_Inward_Voucher psiv on psi.P_Stock_In_Voucher_ID = psiv.P_Stock_In_Voucher_ID
    LEFT JOIN Product_Master pm on psiv.P_ID = pm.P_ID
    LEFT JOIN Company_Master cm on psiv.Co_ID = cm.Co_ID
    WHERE psiv.Co_ID = ? AND psi.status = 50`,
    values: co_id
  })
}



export default Read
