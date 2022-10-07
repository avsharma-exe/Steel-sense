import { cryptPassword } from '../../../helpers/encrypt'
import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  let filters = JSON.parse(req.query.filters)
  let searchterm = req.query.searchTerm
  try {
    let products = await Product.Read.getProductCount(Co_ID, searchterm)
    let total_products = products.length
    let total_pages =
      Math.round(total_products / filters.perPage) < total_products / filters.perPage
        ? parseInt(Math.round(total_products / filters.perPage) + 1)
        : Math.round(total_products / filters.perPage)
    let offset = (filters.pageNo - 1) * filters.perPage

    let allProducts = []

    if (filters.division !== null) {
      allProducts = await Product.Read.getAllProductsOfDivision(Co_ID, filters.division, offset, filters.perPage)
    } else {
      allProducts = await Product.Read.getAllProductsIDsOfACompany(Co_ID, offset, filters.perPage , searchterm)
    }

    console.log(allProducts)

    if (allProducts.length === 0) {
      res.send({
        error: true,
        msg: 'Products Not Found'
      })
    } else {
      res.send({
        error: false,
        allProducts,
        total_pages,
        total_products
      })
    }
  } catch (e) {
    throw e
  }
}
