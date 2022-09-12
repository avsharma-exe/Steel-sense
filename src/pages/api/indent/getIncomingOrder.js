import Indent from '../../../server/queries/Indent/Indent'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  let divisions = req.query['division[]']
  
  try {
    let incommingOrders = await Indent.Read.getIncommingOrders(Co_ID , divisions)
    
    
      res.send({
        error: false,
        incommingOrders
      })
    
  } catch (e) {
    throw e
  }
}
