import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import {
  DatabaseAlertOutline,
  DownloadOutline,
  Send,
  TicketConfirmationOutline,
  ClipboardListOutline
} from 'mdi-material-ui'
import BasicTable from 'src/components/utils/BasicTable'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import { useState, useEffect } from 'react'

import AddNewIndent from 'src/components/indent/AddNewIndent'

const Dashboard = () => {
  const userDetails = useUserDetails()

  const [billEntries, setBillEntries] = useState([])
  const [indentRequest, setIndentRequest] = useState([])
  const [invoiceDue, setInvoiceDue] = useState([])

  const [indents, setIndents] = useState([])
  const [indentsArray, setIndentsArray] = useState([])

  const getIndents = () => {
    secureApi
      .get(api_configs.indent.getAll, {
        params: {
          company: userDetails.Co_ID,
        }
      })
      .then(resp => {
        console.log(resp)
        let indents = []
        setIndents(resp.data.allIndents)
        if (resp.status === 200) {
          resp.data.allIndents.map(indent => {
            indents.push({
              CreatedDT: indent.CreatedDT.split('T')[0],
              StockName: indent.PName,
              Qty: indent.Quantity,
              ExpectedDate: indent.ExpectedDate.split('T')[0],
              CurrentStock: indent.CurrentStock,
              Division: indent.DivisionName
            })
          })
          setIndentsArray(indents)
        }
      })
  }


  useEffect(() => {
    getIndents()
  }, [])

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
                  { id: 'CreatedDT', label: 'Date of Indent', minWidth: 170 },
                  { id: 'StockName', label: 'Stock Name', minWidth: 170 },
                  { id: 'Qty', label: 'Quantity Request', minWidth: 170 },
                  { id: 'ExpectedDate', label: 'Expected Date', minWidth: 170 },
                  { id: 'CurrentStock', label: 'Current Stock', minWidth: 170 },
                  { id: 'Division', label: 'Division', minWidth: 170 },
                  { id: 'LastPrice', label: 'Last Unit Price', minWidth: 170 }
                ]}
                rows={indentsArray}
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
                  { id: 'due_date', label: 'Due Date', minWidth: 170 }
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
                  { id: 'total_price', label: 'Total Price', minWidth: 170 }
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
