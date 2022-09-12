import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import { DatabaseAlertOutline, DownloadOutline, Send, TicketConfirmationOutline } from 'mdi-material-ui'
import BasicTable from 'src/components/utils/BasicTable'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import { useState, useEffect } from 'react'
import AddNewIndent from 'src/components/indent/AddNewIndent'
import { getIndentStatusText } from 'src/helpers/statusHelper'
import useUserDivisions from 'src/hooks/useUserDivisions'
import CreateStockInward from 'src/components/indent/CreateStockInward'
import CircularProgress from '@mui/material/CircularProgress'
import displayDate from 'src/helpers/dateHelper'

const Dashboard = () => {
  const userDetails = useUserDetails()
  const userDivisions = useUserDivisions()
  const [products, setProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [error, setError] = useState(false)
  const [lowStockArray, setLowStockArray] = useState([])
  const [incommingLoader, setIncommingLoader] = useState(false)
  const [lowStockLoader, setLowStockLoader] = useState(false)
  const [indentLoader, setIndentLoader] = useState(false)

  const [indents, setIndents] = useState([])
  const [createStockInward, setCreateStockInward] = useState({
    show: false,
    data: {}
  })
  const [indentsArray, setIndentsArray] = useState([])
  const [addIndentOpen, setAddIndentOpen] = useState(false)
  const [productDetails, setProductDetails] = useState(null)
  const [incommingOrders, setIncommingOrder] = useState([])

  const getIncommingOders = async () => {
    setIncommingLoader(true)
    const incommingOrders = await secureApi.get(api_configs.indent.getIncomingOrder, {
      params: {
        company: userDetails.Co_ID,
        division: userDivisions
      }
    })

    if (incommingOrders.status === 200) {
      let orders = []
      await incommingOrders.data.incommingOrders.forEach(order => {
        if (order) {
          let expectedDate = order.ExpectedDate.split('T')[0]
          let newDate = expectedDate.split('-')
          newDate = new Date(newDate[0], parseInt(newDate[1]) - 1, newDate[2])

          orders.push({
            name: order.PName,
            qty: order.Quantity,
            t_info: order.TruckInfo,
            expectedDate: displayDate(newDate),
            inward: (
              <Button
                variant='contained'
                color='primary'
                style={{ color: 'white', fontSize: 10 }}
                onClick={() =>
                  setCreateStockInward({
                    show: true,
                    data: order
                  })
                }
              >
                Inward
              </Button>
            )
          })
        }
      })
      setCreateStockInward({
        show: false,
        data: {}
      })
      setIncommingOrder(orders)
      setIncommingLoader(false)
    }
  }

  const getLowStockProducts = async () => {
    setLowStockLoader(true)

    await secureApi
      .get(api_configs.product.getLowStockDetails, {
        params: {
          company: userDetails.Co_ID,
          division: userDivisions
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          setLowStockProducts(resp.data.allLowStockProducts)
        }
      })
    setLowStockLoader(false)
  }

  const getIndents = async () => {
    setIndentLoader(true)

    await secureApi
      .get(api_configs.indent.getAll, {
        params: {
          company: userDetails.Co_ID,
          divisions: userDivisions
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          console.log('indents', resp.data.allIndents)
          setIndents(resp.data.allIndents)
          setIndentLoader(false)
        }
      })
  }

  const getProducts = async () => {
    await secureApi
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

  const handleCreateIndent = ({ P_ID, PName, Div_ID }) => {
    setProductDetails({
      id: P_ID,
      name: PName,
      division: Div_ID
    })
    toggleAddIndentDrawer()
  }

  const toggleAddIndentDrawer = () => {
    setAddIndentOpen(!addIndentOpen)
  }

  useEffect(() => {
    getProducts()

    Promise.all([getLowStockProducts(), getIndents(), getIncommingOders()])
  }, [])

  return (
    <>
      {createStockInward.show ? (
        <CreateStockInward
          indent={createStockInward.data}
          onClose={() => {
            setCreateStockInward({
              show: false,
              data: {}
            })
          }}
          updateIncommingOreders={getIncommingOders}
        />
      ) : null}
      <AddNewIndent
        open={addIndentOpen}
        toggle={toggleAddIndentDrawer}
        productDetails={productDetails}
        updateDashboard={() => {
          getIndents()
          getLowStockProducts()
        }}
      />
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
              {incommingLoader ? (
                <CircularProgress
                  sx={{
                    color: 'common.black',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              ) : (
                <BasicTable
                  columns={[
                    { id: 'name', label: 'Name', minWidth: 170 },
                    { id: 'expectedDate', label: 'Expected Date', minWidth: 170 },

                    { id: 'inward', label: 'Inward', minWidth: 170 }
                  ]}
                  rows={incommingOrders}
                />
              )}
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
              {lowStockLoader ? (
                <CircularProgress
                  sx={{
                    color: 'common.black',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              ) : (
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
              )}
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
              {indentLoader ? (
                <CircularProgress
                  sx={{
                    color: 'common.black',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              ) : (
                <BasicTable
                  columns={[
                    { id: 'name', label: 'Name' },
                    { id: 'division', label: 'Division' },
                    { id: 'qty', label: 'Quantity Ordered' },
                    { id: 'liod', label: 'Last Incoming Order Date' },
                    { id: 'eta', label: 'ETA' },
                    { id: 'status', label: 'Status' }
                  ]}
                  rows={
                    !!indents && indents.length
                      ? indents.map(indent => {
                          let expectedDate = indent.ExpectedDate.split('T')[0]
                          let newDate = expectedDate.split('-')
                          newDate = new Date(newDate[0], parseInt(newDate[1]) - 1, newDate[2])
                          return {
                            id: indent.P_Stock_Indent_ID,
                            name: indent.PName,
                            division: indent.DivisionName,
                            qty: indent.Quantity,
                            liod: 'Wed Jun 04 2022',
                            eta: displayDate(newDate),
                            status: getIndentStatusText(indent.CurrentStatus)
                          }
                        })
                      : []
                  }
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
