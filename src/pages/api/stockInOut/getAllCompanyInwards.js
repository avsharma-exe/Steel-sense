import StockInOut from '../../../server/queries/StockInOut/StockInOut'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }


  try {

      let allInwards = await StockInOut.Read.getInwards(req.query.company)

      if (allInwards) {

        res.send({
          error: false,
          allInwards
        })
      }
  } catch (e) {
    throw e
  }
}
