import Product from '../../../server/queries/Product/Product'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  let Co_ID = req.query.company
  let filters = JSON.parse(req.query.filters)

  let divisions =
    req.query['userDivisions[]'].length === 1 ? [req.query['userDivisions[]']] : req.query['userDivisions[]']

  try {
    let products = await Product.Read.getProductCount(Co_ID)
    let total_products = products.length
    let total_pages =
      Math.round(total_products / filters.perPage) < total_products / filters.perPage
        ? parseInt(Math.round(total_products / filters.perPage) + 1)
        : Math.round(total_products / filters.perPage)
    let offset = (filters.pageNo - 1) * filters.perPage

    let allProducts = await Product.Read.getAllProductsIDsOfACompanyByDivisionWithFilters(
      Co_ID,
      divisions,
      offset,
      filters.perPage
    )

    if (allProducts.length === 0) {
      res.send({
        error: true,
        msg: 'Products Not Found',
        total_pages,
        total_products
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
