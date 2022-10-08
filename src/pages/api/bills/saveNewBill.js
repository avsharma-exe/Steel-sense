import StockInOut from '../../../server/queries/StockInOut/StockInOut'
import Indent from '../../../server/queries/Indent/Indent'
import BillEntries from '../../../server/queries/BillEntries/BillEntries'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }
  let body = req.body
  try {
    // create new bill
    const bill = await BillEntries.Create.createNewBillEntry({
      Co_ID: body.Co_ID,
      Supplier_ID: body.supplier.Co_ID,
      status: 0
    })

    let bill_id = bill.insertId

    let iterations = 0
    let i = 0

    for (i = 0; i < body.products.length; i++) {
      let product = body.products[i].product
      console.log(product)
      const createProductStockInwardVoucher = await Indent.Create.productStockInwardVoucher({
        Div_ID: product.Div_ID,
        P_ID: product.P_ID,
        Co_ID: body.Co_ID,
        Indent_ID: null,
        Quantity: body.products[i].qty,
        Supplier_ID: body.supplier.Co_ID
      })

      let voucher_id = createProductStockInwardVoucher.insertId
      const createProductStockInward = await Indent.Create.productStockInward({
        P_Stock_In_Voucher_ID: voucher_id,
        UnitPrice: body.products[i].pricePerPiece,
        TotalAmount: body.products[i].total,
        Bill_Entry_ID: bill_id
      })

      iterations++
    }
    console.log(iterations , i)
    if (iterations === i)
      res.send({
        error: false,
        msg: 'Bill Created'
      })
  } catch (e) {
    throw e
  }
}
