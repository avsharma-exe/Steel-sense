import executeQuery from '../../../../server/Connection'

const Update = {
    updateBillEntry,
}

/**
 * Updates bill entries details 
 * @param {*} body
 * @returns Database update object
 */
function updateBillEntry(body , bill_entry_id) {
  return executeQuery({
    query: 'UPDATE Bill_Entries SET ? WHERE Bill_Entry_ID = ?',
    values: [body , bill_entry_id]
  })
}

export default Update
