import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import { DatabaseAlertOutline, DownloadOutline, Send, TicketConfirmationOutline,ClipboardListOutline } from 'mdi-material-ui'
import BasicTable from 'src/components/utils/BasicTable'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import { useState, useEffect } from 'react'
import AddNewIndent from 'src/components/indent/AddNewIndent'

const Dashboard = () => {
  const [billEntries , setBillEntries] = useState([])
  const [indentRequest , setIndentRequest] = useState([])
  const [invoiceDue , setInvoiceDue] = useState([])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item md={12}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  Indent Request By L3 <DownloadOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
                </Typography>
              }
            ></CardHeader>
            <CardContent>
              <BasicTable
                columns={[
                  { id: 'date_of_indent', label: 'Date of Indent', minWidth: 170 },
                  { id: 'stock_name', label: 'Stock Name', minWidth: 170 },
                  { id: 'qty_req', label: 'Quantity Request', minWidth: 170 },
                  { id: 'last_qty_ordered', label: 'Last Qty Ordered', minWidth: 170 },
                  { id: 'last_order_date', label: 'Last Order Date', minWidth: 170 },
                  { id: 'last_order_price', label: 'Last Order Price', minWidth: 170 },
                  { id: 'current_stock', label: 'Current Stock', minWidth: 170 },
                  { id: 'division', label: 'Division', minWidth: 170 },
                  { id: 'order', label: 'Order', minWidth: 170 }
                ]}
                rows={indentRequest}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  Bill Entity <ClipboardListOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
                </Typography>
              }
            ></CardHeader>
            <CardContent>
              <BasicTable
                columns={[
                  { id: 'date', label: 'Date', minWidth: 170 },
                  { id: 'party_name', label: 'Party Name', minWidth: 170 },
                  { id: 'stock_name', label: 'Stock Name', minWidth: 170 },
                  { id: 'qty', label: 'Quantity', minWidth: 170 },
                  { id: 'unit_price', label: 'Unit Price', minWidth: 170 },
                  { id: 'due', label: 'Due', minWidth: 170 },
                  { id: 'tax', label: 'Tax', minWidth: 170 },
                  { id: 'total_price', label: 'Total Price', minWidth: 170 },
                  { id: 'due_date', label: 'Due Date', minWidth: 170 },
                ]}
                rows={billEntries}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                 Invoice Due <ClipboardListOutline sx={{ ml: 2, color: theme => theme.palette.error.light }} />
                </Typography>
              }
            ></CardHeader>
            <CardContent>
              <BasicTable
                columns={[
                  { id: 'recived_date', label: 'Recieved Date', minWidth: 170 },
                  { id: 'party_name', label: 'Party Name', minWidth: 170 },
                  { id: 'stock_name', label: 'Stock Name', minWidth: 170 },
                  { id: 'qty', label: 'Quantity', minWidth: 170 },
                  { id: 'unit_price', label: 'Unit Price', minWidth: 170 },
                  { id: 'total_price', label: 'Total Price', minWidth: 170 },
                  
                ]}
                rows={invoiceDue}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
