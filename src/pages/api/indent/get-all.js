import Indent from '../../../server/queries/Indent/Indent'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  let Div_ID = req.query.division

  try {
    let allIndents = await Indent.Read.getAllIndentsOfACompanyDivision(Co_ID, Div_ID)
    // allIndents.forEach(async (indent, index) => {
    //   allIndents[index]['indentParticulars'] = await Indent.Read.getIndentParticulars(indent.P_Stock_Indent_ID)
    //   // allIndents[index]['indentParticulars'].forEach(async (particular, index) => {
    //   //   const product = await Product.Read.getProductMasterData(particular.P_ID) 
    //   //   allIndents[index]['indentParticulars'][index]['PName'] = product[0].PName
    //   // })
    //   // console.log('indent ID', indent['P_Stock_Indent_ID'])
    //   if (index >= allIndents.length - 1) {
    //   console.log('indent', allIndents);
    //   if (allIndents) {
    //       res.send({
    //         error: false,
    //         allIndents
    //       })
    //     }
    //   }
    // })
    if (allIndents) {
      res.send({
        error: false,
        allIndents
      })
    }
  } catch (e) {
    throw e
  }
}
