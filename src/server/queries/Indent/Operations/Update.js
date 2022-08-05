import executeQuery from '../../../../server/Connection'

const Update = {
  updateIndentStatus,
  updateIndentApprovedBy,
  indentParticular
}

function updateIndentStatus(status , indent_particular) {
  return executeQuery({
    query: `UPDATE Product_Stock_Indent_Particulars SET CurrentStatus = ? WHERE P_Stock_Indent_Particulars_ID = ?`,
    values: [status,indent_particular]
  })
}

function updateIndentApprovedBy(user , indent) {
  return executeQuery({
    query: `UPDATE Product_Stock_Indent SET ApprovedBy = ? WHERE P_Stock_Indent_ID = ?`,
    values: [user,indent]
  })
}

function indentParticular(qty , ex_date,indent) {
  return executeQuery({
    query: `UPDATE Product_Stock_Indent_Particulars SET Quantity = ?, ExpectedDate = ? WHERE P_Stock_Indent_Particulars_ID = ?`,
    values: [qty,ex_date, indent]
  })
}


export default Update
