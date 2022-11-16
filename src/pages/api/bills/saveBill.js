import BillEntries from 'src/server/queries/BillEntries/BillEntries'
import StockInOut from 'src/server/queries/StockInOut/StockInOut'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let body = req.body
  let updateArray = []
  try {
    const { Bill_Entry_ID, billProducts } = body
    
    delete body['billProducts']

    let saveBill = await BillEntries.Update.updateBillEntry(body, Bill_Entry_ID)

    for (let index = 0; index < billProducts.length; index++) {
      let billProduct = billProducts[index]
      let updateBillProduct = await StockInOut.Update.updateBillEntry(
        {
          TaxPercent: billProduct['TaxPercent'],
          DiscountPercent: billProduct['DiscountPercent'],
          TotalAmount: billProduct['TotalAmount']
        },
        billProduct['P_Stock_In_ID']
      )
      console.log(updateBillProduct)
      updateArray.push(updateBillProduct)
    }

    if (saveBill) {
      res.send({
        error: false,
        msg: 'Bill Saved Successfully',
        saveBill
      })
    }
  } catch (e) {
    throw e
  }
}
