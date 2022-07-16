import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import { DatabaseAlertOutline, DownloadOutline, Send, TicketConfirmationOutline } from 'mdi-material-ui'
import BasicTable from 'src/components/utils/BasicTable'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import { useState, useEffect } from 'react'
import AddNewIndent from 'src/components/indent/AddNewIndent'
import { getIndentStatusText } from 'src/helpers/statusHelper'

const Dashboard = () => {
  const userDetails = useUserDetails()
  const [products, setProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [error, setError] = useState(false)
  const [lowStockArray, setLowStockArray] = useState([])
  const [indents, setIndents] = useState([])
  const [indentsArray, setIndentsArray] = useState([])
  const [addIndentOpen, setAddIndentOpen] = useState(false)
  const [productDetails, setProductDetails] = useState(null)

  const getLowStockProducts = () => {
    secureApi
      .get(api_configs.product.getLowStockDetails, {
        params: {
          company: userDetails.Co_ID,
          division: userDetails.Div_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          setLowStockProducts(resp.data.allLowStockProducts)
          // console.log('low stock', resp.data.allLowStockProducts)
        }
      })
  }

  const getIndents = () => {
    secureApi
      .get(api_configs.indent.getAll, {
        params: {
          company: userDetails.Co_ID,
          division: userDetails.Div_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          console.log('indents', resp.data.allIndents)
          setIndents(resp.data.allIndents)
        }
      })
  }

  const getProducts = () => {
    secureApi
      .get(api_configs.product.getAll, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          // console.log(resp.data.allProducts)
        }
      })
  }

  const handleCreateIndent = ({ P_ID, PName }) => {
    setProductDetails({
      id: P_ID,
      name: PName
    })
    toggleAddIndentDrawer()
  }

  const toggleAddIndentDrawer = () => {
    setAddIndentOpen(!addIndentOpen)
  }

  useEffect(() => {
    // getProducts()
    getLowStockProducts()
    getIndents()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                Incoming Order Details <DownloadOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
              </Typography>
            }
          ></CardHeader>
          {/* <Divider /> */}

          <CardContent>
            <BasicTable
              columns={[
                { id: 'name', label: 'Name', minWidth: 170 },
                { id: 'qty', label: 'Quantity', minWidth: 170 },
                { id: 't_info', label: 'Truck Info', minWidth: 170 }
              ]}
              rows={[
                { name: 'TNT-BAR', qty: '10', t_info: 'MH-49-AD-1867' },
                { name: 'BEARING NO 6202 ZZ', qty: '8', t_info: 'MH-49-AD-1866' },
                { name: 'Steel Nut', qty: '18', t_info: 'MH-49-AD-1865' },
                { name: 'Copper', qty: '1', t_info: 'MH-49-AD-1864' }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                Low Stock Alert <DatabaseAlertOutline sx={{ ml: 2, color: theme => theme.palette.error.main }} />
              </Typography>
            }
          ></CardHeader>
          {/* <Divider /> */}
          <CardContent>
            <BasicTable
              columns={[
                { id: 'name', label: 'Name', minWidth: 170 },
                { id: 'qty', label: 'Stock Available / Min Quantity', minWidth: 170 },
                { id: 're_order_button', label: 'Reorder', minWidth: 170 }
              ]}
              rows={
                !!lowStockProducts && lowStockProducts.length
                  ? lowStockProducts.map(product => ({
                      id: product.P_ID,
                      name: product.PName,
                      qty: `${product.CurrentStock}/${product.LowStockLimit}`,
                      re_order_button: (
                        <Button
                          variant='contained'
                          endIcon={<Send />}
                          style={{ color: 'white', fontSize: 10 }}
                          onClick={() => handleCreateIndent(product)}
                        >
                          Create Indent
                        </Button>
                      )
                    }))
                  : []
              }
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                Indent <TicketConfirmationOutline sx={{ ml: 2, color: theme => theme.palette.primary.main }} />
              </Typography>
            }
          ></CardHeader>
          <CardContent>
            <BasicTable
              columns={[
                { id: 'name', label: 'Name' },
                { id: 'qty', label: 'Quantity Ordered' },
                { id: 'liod', label: 'Last Incoming Order Date' },
                { id: 'eta', label: 'ETA' },
                { id: 'status', label: 'Status' }
              ]}
              rows={
                !!indents &&
                indents.length ?
                indents.map(indent => ({
                  id: indent.P_Stock_Indent_ID,
                  name: indent.PName,
                  qty: indent.Quantity,
                  liod: 'Wed Jun 04 2022',
                  eta: indent.ExpectedDate,
                  status: getIndentStatusText(indent.CurrentStatus)
                })) : []
              }
            />
          </CardContent>
        </Card>
      </Grid>
      <AddNewIndent open={addIndentOpen} toggle={toggleAddIndentDrawer} productDetails={productDetails} />
    </Grid>
  )
}

export default Dashboard
