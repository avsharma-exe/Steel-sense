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

import PencilOutline from 'mdi-material-ui/PencilOutline'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'

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
import displayDate from 'src/helpers/dateHelper'
import useUserDivisions from 'src/hooks/useUserDivisions'
import CreateMultiplePurchaseOrder from 'src/components/indent/CreateMultiplePurchaseOrder'

const Dashboard = () => {
  const userDetails = useUserDetails()
  const userDivisions = useUserDivisions()
  const [billEntries, setBillEntries] = useState([])
  const [indentRequest, setIndentRequest] = useState([])
  const [invoiceDue, setInvoiceDue] = useState([])
  const [showApproveMultipleForm, setShowApproveMultipleForm] = useState({
    show: false,
    indents: []
  })

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
  const [allSuppliers, setAllSuppliers] = useState([])

  const getSuppliers = async () => {
    await secureApi.get(api_configs.supplier.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.status === 200) {
        setAllSuppliers(res.data.allCompanies)
      }
    })
  }

  const getBillEntires = () => {
    secureApi
      .get(api_configs.stockInOut.getBillEntries, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          console.log(resp.data.allBillEntries)
          let billEntries = resp.data.allBillEntries && resp.data.allBillEntries.map(entry => {
            let newDate = entry.InvoiceDate.split('-')
            return {
              party_name: entry.CompanyName,
              date: displayDate(new Date(newDate[2], parseInt(newDate[1]) - 1, newDate[0])),
              stock_name: entry.PName,
              qty: entry.Quantity + ' ' + entry.Unit,
              unit_price: '₹' + entry.UnitPrice + ' per ' + entry.Unit,

              tax: entry.TaxPercent === 0 ? '-' : entry.TaxPercent,
              total_price: '₹' + entry.TotalAmount,
              due_date: entry.DueOn ? entry.DueOn : '-',
              actions: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title='Edit Bill Entry'>
                    <Box>
                      <Link href={`/l2/edit-bill/${entry.P_Stock_In_Voucher_ID}?company=${entry.company}`} passHref>
                        <IconButton size='small' sx={{ mr: 0.5 }}>
                          <PencilOutline />
                        </IconButton>
                      </Link>
                    </Box>
                  </Tooltip>
                </Box>
              )
            }
          })

          setBillEntries(billEntries)
        }
      })
  }

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
          resp.data.allIndents
            ? resp.data.allIndents.map((indent, index) => {
                let expectedDate = indent.ExpectedDate.split('T')[0]
                let newDate = expectedDate.split('-')
                newDate = new Date(newDate[0], parseInt(newDate[1]) - 1, newDate[2])
                indents.push({
                  indent,
                  CreatedDT: indent.CreatedDT.split('T')[0],
                  StockName: indent.PName,
                  Qty: indent.Quantity + ' ' + indent.UnitName,
                  ExpectedDate: displayDate(newDate),
                  CurrentStock: indent.CurrentStock + ' ' + indent.UnitName,
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
            : null
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
    Promise.all([getIndents(), getBillEntires(), getSuppliers()])
  }, [])

  return (
    <>
      {showApproveMultipleForm.show && (
        <CreateMultiplePurchaseOrder
          indentsList={showApproveMultipleForm.indents}
          allSuppliers={allSuppliers}
          handleClose={() => {
            setShowApproveMultipleForm({
              show: false,
              indents: []
            })
            getIndents()
          }}
        />
      )}
      <CreateProductInward
        afterCreation={() => {
          sendApproval(true, true)
        }}
        open={showProductStockInwardVoucher.show}
        productDetails={showProductStockInwardVoucher.data}
        toggle={() => {
          sendApproval(true, true)
          setShowProductStockInwardVoucher({
            show: !showProductStockInwardVoucher.show,
            data: {}
          })
        }}
        close={() => {
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
            Approve & Create Purchase Order
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
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    Indent Request By L3 <DownloadOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
                  </Typography>
                  <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                    {userDetails.Role_ID == 4 ? null : (
                      <Button
                        size='small'
                        type='submit'
                        variant='contained'
                        onClick={() =>
                          setShowApproveMultipleForm({
                            show: true,
                            indents:
                              indentsArray &&
                              indentsArray.map(indent => {
                                return {
                                  StockName: indent['StockName'],
                                  Division: indent['Division'],
                                  Qty: indent['Qty'],
                                  supplier: '',
                                  expected_date: '',
                                  qty: '',
                                  unit_p: '',
                                  total: 0,
                                  indent
                                }
                              })
                          })
                        }
                      >
                        Approve Multiple
                      </Button>
                    )}
                  </Box>
                </Box>
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
                  { id: 'actions', label: 'Actions', minWidth: 170 }
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
                  { id: 'actions', label: 'Actions', minWidth: 170 },
                  { id: 'date', label: 'Date', minWidth: 170 },
                  { id: 'party_name', label: 'Party Name', minWidth: 170 },
                  { id: 'stock_name', label: 'Stock Name', minWidth: 170 },
                  { id: 'qty', label: 'Quantity', minWidth: 170 },
                  { id: 'unit_price', label: 'Unit Price', minWidth: 170 },
                  // { id: 'due', label: 'Due', minWidth: 170 },
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
