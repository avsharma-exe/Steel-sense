import BillEntries from 'src/server/queries/BillEntries/BillEntries'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let body = req.body
  
  try {
    const {Bill_Entry_ID} = body
    let saveBill = await BillEntries.Update.updateBillEntry(body , Bill_Entry_ID);

    if(saveBill) {
        res.send({
            error: false,
            msg: "Bill Saved Successfully",
            saveBill
        })
    }
  } catch (e) {
    throw e
  }
}