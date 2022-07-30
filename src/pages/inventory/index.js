// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DownloadOutline from 'mdi-material-ui/DownloadOutline'
import Domain from 'mdi-material-ui/Domain'
import { Box } from '@mui/material'
import BasicTable from 'src/components/utils/BasicTable'
import Button from '@mui/material/Button'
import { useState, useEffect } from 'react'
import AddProductForm from '../../components/inventory/AddProductForm'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import EditProductForm from 'src/components/inventory/EditProductForm'

const Inventory = () => {
  const userDetails = useUserDetails()
  const [products, setProducts] = useState([])
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [editProduct, setEditProduct] = useState({})
  const [showEditProductForm, setShowEditProductForm] = useState(false)

  const [selectedRowData, setSelectedRowData] = useState({})
  const [openNew, setOpenNew] = useState(false)
  const [newRowData, setNewRowData] = useState({})

  const getProducts = () => {
    setShowLoader(true)
    secureApi
      .get(api_configs.product.getAll, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          let allProducts = []
          if (resp.data.allProducts) {
            resp.data.allProducts.map((product, index) => {
              let productRow = {
                srNo: <Typography data={product}>{index + 1}</Typography>,
                productName:
                  product.productDetails.length > 0 ? (
                    <Tooltip
                      title={
                        'Print Name: ' + product.productDetails[0].PPrintName
                          ? product.productDetails[0].PPrintName
                          : product.productDetails[0].PName
                      }
                      arrow
                    >
                      <Typography>{product.productDetails[0].PName}</Typography>
                    </Tooltip>
                  ) : (
                    ''
                  ),
                productGroup:
                  product.productDetails.length > 0 ? (
                    <Tooltip title={'Product Brand: ' + product.productDetails[0].PBrand} arrow>
                      <Typography>{product.productDetails[0].PGroup}</Typography>
                    </Tooltip>
                  ) : (
                    ''
                  ),
                productItemCode: <Typography>{product.productDetails[0].PItemCode}</Typography>,
                stock:
                  product.stockDetails[0].CurrentStock > product.stockDetails[0].LowStockLimit ? (

                    // <Chip label={product.stockDetails[0].CurrentStock} color='success' />
                    <Chip label={product.stockDetails[0].CurrentStock} sx={{ color: 'green' }} />
                  ) : (

                    // <Chip label={product.stockDetails[0].CurrentStock} color='danger' />
                    <Chip label={product.stockDetails[0].CurrentStock} sx={{ color: 'red' }} />
                  )
              }
              allProducts.push(productRow)
            })
          }

          setProducts(allProducts)
          setShowLoader(false)
        }
      })
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      {showAddProductForm ? (
        <AddProductForm onCloseHandle={setShowAddProductForm} getProducts={() => getProducts()} />
      ) : null}
      {showEditProductForm ? (
        <EditProductForm
          onCloseHandle={setShowEditProductForm}
          product={editProduct}
          getProducts={() => getProducts()}
        />
      ) : null}
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant={'h6'}>Inventory</Typography>
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                { userDetails.Role_ID == 4 ? null :
                <Button size='small' type='submit' variant='contained' onClick={() => setShowAddProductForm(true)}>
                Add Product
                </Button>
                }
              </Box>
            </Box>
          }
        />
        {/* <Divider /> */}

        <CardContent>
          {products.length > 0 ? (
            <BasicTable
              columns={[
                { id: 'srNo', label: 'Sr No.' },
                { id: 'productName', label: 'Product Name' },
                { id: 'productGroup', label: 'Product Group' },
                { id: 'productItemCode', label: 'Product Item Code' },
                { id: 'stock', label: 'Stock Available' }

                // { id: 'actions', label: 'Actions', minWidth: 170 }
              ]}
              rows={products}
              onRowClickHandle={rowData => {
                if( userDetails.Role_ID !== 4 ){
                  setEditProduct(rowData.srNo.props.data)
                  setShowEditProductForm(true)
                }
              }}
            />
          ) : showLoader ? (
            <CircularProgress
              sx={{
                color: 'common.black',
                width: '20px !important',
                height: '20px !important',
                mr: theme => theme.spacing(2)
              }}
            />
          ) : (
            <Typography>No Products Found</Typography>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Inventory
