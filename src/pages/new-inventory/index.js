import { useState, useEffect } from 'react'
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import Pagination from '@mui/material/Pagination'

// ** Custom Components
import AddProductForm from '../../components/inventory/AddProductForm'
import EditProductForm from 'src/components/inventory/EditProductForm'
import UseProductForm from 'src/components/inventory/UseProductForm'
import ProductCard from 'src/components/inventory/ProductCard'
import Filters from 'src/components/inventory/Filters'
import Search from 'src/components/inventory/Search'
import Analytics from 'src/components/inventory/Analytics'

// ** Helpers
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import useUserDivisions from 'src/hooks/useUserDivisions'
import { AllInclusiveBox } from 'mdi-material-ui'

const Inventory = () => {
  const userDetails = useUserDetails()
  const userDivisions = useUserDivisions()
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [editProduct, setEditProduct] = useState({})
  const [showEditProductForm, setShowEditProductForm] = useState(false)
  const [divs, setDivisions] = useState(null)
  const [filters, setFilters] = useState({
    perPage: 6,
    division: null,
    status: null,
    pageNo: 1
  })
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const [useProductForm, setUseProductForm] = useState({
    show: false,
    data: {}
  })

  const onEditHandle = data => {
    setEditProduct(data)
    setShowEditProductForm(true)
  }

  const onUseStockHandle = product => {
    setUseProductForm({
      show: true,
      data: product
    })
  }

  const getAllDivisions = async () => {
    let allDivs = await secureApi(api_configs.division.getAll, {
      params: {
        coid: userDetails.Co_ID
      }
    })
    if (allDivs.status === 200) {
      if (!userDivisions.includes('0')) {
        setDivisions(
          allDivs.data.allDivisions.filter(function (div) {
            if (userDivisions.includes(String(div.Div_ID))) {
              return div
            }
          })
        )
      } else {
        setDivisions(allDivs.data.allDivisions)
      }
    }
  }

  const getProducts = () => {
    {
      setShowLoader(true)
      divs
        ? secureApi
            .get(userDivisions.includes('0') ? api_configs.product.getAll : api_configs.product.getDivProducts, {
              params: {
                company: userDetails.Co_ID,
                div_id: userDetails.Div_ID,
                userDivisions,
                filters,
                searchTerm
              }
            })
            .then(resp => {
              if (resp.status === 200) {
                setProducts(resp.data.allProducts)
                setTotalPages(resp.data.total_pages)
                setTotalProducts(resp.data.total_products)
                setShowLoader(false)
              }
            })
        : null
    }
  }
  useEffect(() => {
    setFilters({ ...filters, pageNo: 1 })
  }, [searchTerm])

  useEffect(() => {
    getProducts()
  }, [filters, searchTerm])

  useEffect(() => {
    getAllDivisions()
  }, [])

  useEffect(() => {
    getProducts()
  }, [divs])

  return (
    <>
      <UseProductForm
        productDetails={useProductForm.data}
        show={useProductForm.show}
        handleClose={() =>
          setUseProductForm({
            show: false,
            data: {}
          })
        }
      />
      {showAddProductForm ? (
        <AddProductForm onCloseHandle={setShowAddProductForm} getProducts={() => getProducts()} allDivs={divs} />
      ) : null}
      {showEditProductForm ? (
        <EditProductForm
          onCloseHandle={setShowEditProductForm}
          product={editProduct}
          getProducts={() => getProducts()}
        />
      ) : null}
      <Grid container>
        <Grid md={3} xl={3} sm={12}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Search for Products
          </Typography>
          <Typography variant='body2' sx={{ mb: 4 }}>
            Type Name, Unit or Division
          </Typography>
          <Search searchTerm={searchTerm} handleOnChange={value => setSearchTerm(value)} />
          <Analytics totalProducts={totalProducts} />
        </Grid>
        <Grid md={9} xl={9} sm={12}>
          <Filters
            divisions={divs}
            addProductClickHandle={() => setShowAddProductForm(true)}
            filters={filters}
            handleFilterChange={value => setFilters(value)}
          />
          <Grid container>
            {products?.length > 0
              ? products.map(product => {
                  return (
                    <Grid md={4} xl={4} sm={4}>
                      <ProductCard
                        product={product}
                        onEditHandle={product => onEditHandle(product)}
                        onUseStockHandle={product => onUseStockHandle(product)}
                      />
                    </Grid>
                  )
                })
              : null}
          </Grid>
          <Pagination
            count={totalPages}
            page={filters.pageNo}
            onChange={(event, value) => {
              setFilters({ ...filters, pageNo: value })
            }}
            color='primary'
            sx={{ float: 'right', mt: 3 }}
          />
        </Grid>
        <Grid md={4} xl={4} sm={12}></Grid>
      </Grid>
    </>
  )
}

export default Inventory
