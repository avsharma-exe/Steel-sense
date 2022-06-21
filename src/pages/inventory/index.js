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

const Inventory = () => {
  const userDetails = useUserDetails()
  const [products, setProducts] = useState([])
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState({})
  const [openNew, setOpenNew] = useState(false)
  const [newRowData, setNewRowData] = useState({})

  const getProducts = () => {
    secureApi
      .get(api_configs.product.getAll, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          let allProducts = []
          resp.data.allProducts.map(product => {
            let productRow = {
              productName:
                product.productDetails.length > 0 ? (
                  <Tooltip
                    title={
                      "Print Name: " + product.productDetails[0].PPrintName
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
                  <Tooltip title={"Product Brand: " + product.productDetails[0].PBrand} arrow>
                    <Typography>{product.productDetails[0].PGroup}</Typography>
                  </Tooltip>
                ) : (
                  ''
                ),
              productItemCode: <Typography>{product.productDetails[0].PItemCode}</Typography>,
              stock: product.stockDetails.length > 0 ? <><Chip label={product.stockDetails[0].CurrentStock} color='success' /> <span>/</span> <Chip label={product.stockDetails[0].LastStock} color='error' /></> : ""
            }
            console.log(productRow)
            allProducts.push(productRow)
          })

          setProducts(allProducts)
        }
      })
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      {showAddProductForm ? <AddProductForm onCloseHandle={setShowAddProductForm} /> : null}
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant={'h6'}>Inventory</Typography>
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                <Button size='small' type='submit' variant='contained' onClick={() => setShowAddProductForm(true)}>
                  Add Product
                </Button>
              </Box>
            </Box>
          }
        />
        {/* <Divider /> */}

        <CardContent>
          <BasicTable
            columns={[
              { id: 'productName', label: 'Product Name' },
              { id: 'productGroup', label: 'Product Group' },
              { id: 'productItemCode', label: 'Product Item Code' },
              { id: 'stock', label: 'Current Stock / Last Stock' },

              // { id: 'actions', label: 'Actions', minWidth: 170 }
            ]}
            rows={products}
            onRowClickHandle={rowData => {}}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Inventory
