import { Grid, Card, CardHeader, Typography, CardContent, Button } from "@mui/material"
import { DatabaseAlertOutline, DownloadOutline, Send, TicketConfirmationOutline } from "mdi-material-ui"
import BasicTable from "src/components/utils/BasicTable"
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import { useState, useEffect } from 'react'

const Dashboard = () => {

  const userDetails = useUserDetails()
  const [products, setProducts] = useState([])

  const getProducts = () => {
    secureApi
      .get(api_configs.product.getAll, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          console.log(resp.data.allProducts)
        }
      })
  }

  useEffect(() => {
    getProducts()
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
                { id: 'qty', label: 'Quantity / Max Quantity', minWidth: 170 },
                { id: 're_order_button', label: 'Reorder', minWidth: 170 }
              ]}
              rows={[
                {
                  name: 'Copper',
                  qty: '1/4',
                  re_order_button: (
                    <Button variant='contained' endIcon={<Send />} style={{ color: 'white' }}>
                      Create Indent
                    </Button>
                  )
                },
                {
                  name: 'Steel Plates',
                  qty: '1/3',
                  re_order_button: (
                    <Button variant='contained' endIcon={<Send />} style={{ color: 'white' }}>
                      Create Indent
                    </Button>
                  )
                }
              ]}
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
                { id: 'qty', label: 'Quantity' },
                { id: 'liod', label: 'Last Incoming Order Date' },
                { id: 'eta', label: 'ETA' },
                { id: 'status', label: 'Status' }
              ]}
              rows={[
                {
                  name: 'Iron Rods',
                  qty: '150',
                  liod: 'Wed Jun 04 2022',
                  eta: 'Wed Jun 08 2022',
                  status: 'Under Approval'
                },
                { name: 'Iron Filings', qty: '15', liod: 'Wed Jun 03 2022', eta: 'Wed Jun 10 2022', status: 'Under Approval' }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard;
