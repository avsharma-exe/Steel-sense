import executeQuery from '../../../../server/Connection'

const Update = {
  updateIndentStatus,
  updateIndentApprovedBy
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


export default Update
