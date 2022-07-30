import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import {
  DatabaseAlertOutline,
  DownloadOutline,
  Send,
  TicketConfirmationOutline,
  ClipboardListOutline,
  CheckCircleOutline,
  Creation
} from 'mdi-material-ui'
import BasicTable from 'src/components/utils/BasicTable'
import { secureApi } from 'src/helpers/apiGenerator'
import toast from 'react-hot-toast'

import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import CreateProductInward from 'src/components/indent/CreateProductInward'

const Dashboard = () => {
  const userDetails = useUserDetails()

  const [billEntries, setBillEntries] = useState([])
  const [indentRequest, setIndentRequest] = useState([])
  const [invoiceDue, setInvoiceDue] = useState([])

  const [showProductStockInwardVoucher, setShowProductStockInwardVoucher] = useState({
    show: false,
    data: {}
  })

  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    data: {}
  })

  const [indents, setIndents] = useState([])

  const [indentsArray, setIndentsArray] = useState([])

  const getIndents = () => {
    secureApi
      .get(api_configs.indent.getAll, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
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
              Division: indent.DivisionName,
              actions:
                indent.CurrentStatus === 0 ? (
                  <Button
                    variant='contained'
                    endIcon={<CheckCircleOutline />}
                    color={'success'}
                    style={{ color: 'white' }}
                    onClick={() => {
                      setConfirmDialog({
                        show: true,
                        data: indent
                      })
                    }}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button
                    variant='contained'
                    endIcon={<Creation />}
                    color={'primary'}
                    style={{ color: 'white' }}
                    onClick={() => {
                      setShowProductStockInwardVoucher({
                        show: true,
                        data: indent
                      })
                      setConfirmDialog({
                        show: false,
                        data: indent
                      })
                    }}
                  >
                    Purchase Order
                  </Button>
                )
            })
          })
          setIndentsArray(indents)
        }
      })
  }

  const sendApproval = async (createStockInward, update) => {
    const approveIndent = await secureApi.put(api_configs.indent.approve, {
      user: userDetails.User_ID,
      indent_particular: confirmDialog.data.indent_particulars_id,
      indent: confirmDialog.data.indent_id,
      update,
      createStockInward
    })

    if (approveIndent.status === 200) {
      setConfirmDialog({
        show: false,
        data: confirmDialog.data
      })
      toast.success('Indent Approved')
      getIndents()
    }
  }

  const approveIndent = async (createStockInward, update) => {
    if (createStockInward) {
      setShowProductStockInwardVoucher({
        show: true,
        data: confirmDialog.data
      })
      setConfirmDialog({
        show: false,
        data: confirmDialog.data
      })
    } else {
      sendApproval(createStockInward, update)
    }
  }

  useEffect(() => {
    getIndents()
  }, [])

  return (
    <>
      <CreateProductInward
        afterCreation={() => {
          sendApproval(true, true)
        }}
        open={showProductStockInwardVoucher.show}
        productDetails={showProductStockInwardVoucher.data}
        toggle={() => {
          sendApproval(true , true);
          setShowProductStockInwardVoucher({
            show: !showProductStockInwardVoucher.show,
            data: {}
          })
        }}
      />
      <Dialog
        open={confirmDialog.show}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
          }
          setConfirmDialog({
            show: false,
            data: confirmDialog.data
          })
        }}
      >
        <DialogTitle id='alert-dialog-title'>Approve Indent?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Typography>
              <b>Stock -</b> {confirmDialog.data.PName ? confirmDialog.data.PName : ''}
            </Typography>
            <Typography>
              <b>Quantity Requested - </b>
              {confirmDialog.data.Quantity ? confirmDialog.data.Quantity : ''}
            </Typography>
            <Typography>
              <b>Current Stock - </b>
              {confirmDialog.data.CurrentStock ? confirmDialog.data.CurrentStock : ''}
            </Typography>
            <Typography>
              <b>Reason - </b> {confirmDialog.data.Description ? confirmDialog.data.Description : ''}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color={'success'} onClick={() => approveIndent(true, true)}>
            Approve & Create Stock Inward
          </Button>
          <Button color={'primary'} onClick={() => approveIndent(false, true)}>
            Approve
          </Button>
          <Button color={'error'} onClick={() => approveIndent(false, false)}>
            Decline
          </Button>
        </DialogActions>
      </Dialog>
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
                  { id: 'actions', label: 'Actions', minWidth: 170 },
                  { id: 'Qty', label: 'Quantity Request', minWidth: 170 },
                  { id: 'ExpectedDate', label: 'Expected Date', minWidth: 170 },
                  { id: 'CurrentStock', label: 'Current Stock', minWidth: 170 },
                  { id: 'Division', label: 'Division', minWidth: 170 },
                  { id: 'LastPrice', label: 'Last Unit Price', maxWidth: 200 }
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
