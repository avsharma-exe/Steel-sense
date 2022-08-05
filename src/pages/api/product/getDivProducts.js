import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  let Div_ID = req.query.div_id

  console.log(Co_ID,Div_ID,"Here")

  try {
    let allProducts = await Product.Read.getAllDivsionProducts(Co_ID,Div_ID)
    if(allProducts.length === 0) res.send({
      error: true,
      msg: "Products Not Found"
    })

    if (allProducts) {

        res.send({
          error: false,
          allProducts
        })
      }
  } catch (e) {
    throw e
  }
}
