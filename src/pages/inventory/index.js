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
import CircularProgress from '@mui/material/CircularProgress'
import EditProductForm from 'src/components/inventory/EditProductForm'
import useUserDivisions from 'src/hooks/useUserDivisions'
import CustomChip from 'src/@core/components/mui/chip'
import { getStatusText } from 'src/helpers/statusHelper'
import Exclamation from 'mdi-material-ui/Exclamation'
import CheckCircle from 'mdi-material-ui/CheckCircle'

const Inventory = () => {
  const userDetails = useUserDetails()
  const userDivisions = useUserDivisions()
  const [products, setProducts] = useState([])
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [editProduct, setEditProduct] = useState({})
  const [showEditProductForm, setShowEditProductForm] = useState(false)
  const [divs, setDivisions] = useState(null)
  const [selectedRowData, setSelectedRowData] = useState({})
  const [openNew, setOpenNew] = useState(false)
  const [newRowData, setNewRowData] = useState({})

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
                userDivisions
              }
            })
            .then(resp => {
              if (resp.status === 200) {
                let allProducts = []
                if (resp.data.allProducts) {
                  resp.data.allProducts.map((product, index) => {
                    let productRow = {
                      srNo: <Typography data={product}>{index + 1}</Typography>,
                      productName: <Typography>{product.PName}</Typography>,

                      stock:
                        product.CurrentStock > product.LowStockLimit ? (
                          // <Chip label={product.CurrentStock} color='success' />
                          <CustomChip
                            size='small'
                            skin='light'
                            color='success'
                            label={product.CurrentStock}
                            icon={<CheckCircle fontSize='small' />}
                          />
                        ) : (
                          // <Chip label={product.CurrentStock} color='danger' />
                          <CustomChip
                            size='small'
                            skin='light'
                            color='error'
                            label={product.CurrentStock}
                            icon={<Exclamation fontSize='small' />}
                          />
                        ),
                      division: (
                        <Typography>
                          {divs.map(div => {
                            console.log(div.Div_ID, product.Div_ID, div.DivisionName, product.PName)
                            if (div.Div_ID === product.Div_ID) {
                              return <CustomChip size='small' skin='light' color='primary' label={div.DivisionName} />
                            }
                          })}
                        </Typography>
                      ),
                      status: getStatusText(product.status)
                    }
                    allProducts.push(productRow)
                  })
                }

                setProducts(allProducts)
                setShowLoader(false)
              }
            })
        : null
    }
  }

  useEffect(() => {
    getAllDivisions()
  }, [])

  useEffect(() => {
    getProducts()
  }, [divs])

  return (
    <>
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
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant={'h6'}>Inventory</Typography>
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                {userDetails.Role_ID == 4 ? null : (
                  <Button size='small' type='submit' variant='contained' onClick={() => setShowAddProductForm(true)}>
                    Add Product
                  </Button>
                )}
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
                { id: 'stock', label: 'Stock Available' },
                { id: 'division', label: 'Division' },
                { id: 'status', label: 'Status' }

                // { id: 'actions', label: 'Actions', minWidth: 170 }
              ]}
              rows={products}
              onRowClickHandle={rowData => {
                if (userDetails.Role_ID !== 4) {
                  setEditProduct(rowData.srNo.props.data)
                  setShowEditProductForm(true)
                }
              }}
              reload={getProducts}
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
