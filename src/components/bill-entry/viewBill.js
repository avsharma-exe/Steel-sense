// ** React Imports
import { useState, forwardRef, useEffect, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'

import TableHead from '@mui/material/TableHead'
import Link from 'next/link'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Plus from 'mdi-material-ui/Plus'
import Close from 'mdi-material-ui/Close'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styles
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Helpers
import displayAmount from 'src/helpers/displayAmount'
import displayDate from 'src/helpers/dateHelper'
import displayBillDate from 'src/helpers/displayBillDate'
import ReactToPdf from 'react-to-pdf'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      size='small'
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  )
})

const invoiceNumberPad = '0000'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const ViewBillComponent = props => {
  // ** Props
  const {
    companyDetails,
    supplierDetails,
    billDetails,

    viewBillData,
    setViewBillData,
    billProducts
  } = props

  useEffect(() => {
    if (billProducts.length > 0) {
      let totalAmt = billProducts.reduce((acc, obj) => {
        return acc + obj.TotalAmount
      }, 0)

      setViewBillData({
        ...viewBillData,
        subTotal: totalAmt,
        total: viewBillData && totalAmt + (totalAmt * viewBillData.tax) / 100 - (totalAmt * viewBillData.discount) / 100
      })
    }
  }, [viewBillData, billProducts])

  const PreviewRef = useRef(null)

  return (
    <>
      <Card ref={PreviewRef}>
        <CardContent>
          <Grid container row>
            <Grid item sm={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h6' sx={{ ml: 2, fontWeight: 700 }}>
                    {companyDetails.CompanyName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ ml: 2, mb: 1 }}>
                    {companyDetails.Address1}
                  </Typography>
                  <Typography variant='body2' sx={{ ml: 2, mb: 1 }}>
                    {companyDetails.Address2}
                  </Typography>
                  <Typography variant='body2' sx={{ ml: 2, mb: 1 }}>
                    {' '}
                    {companyDetails.Pincode}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12} >
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '200px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6' sx={{ mr: 2, fontWeight: 700 }}>Invoice</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h6'>{`#${billDetails && billDetails.Bill_Name}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body3'>Issue Date:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body3'>{billDetails && displayBillDate(new Date(billDetails.InvoiceDate))}</Typography>
                      </MUITableCell>
                    </TableRow>
                    
                  </TableBody>
                </Table>
              </Box>
            </Grid>
            
          </Grid>
        </CardContent>

        <Divider sx={{ mt: 1, mb: 1 }} />

        {billDetails ? (
          <CardContent sx={{ pb: 2 }}>
            <Grid container>
              <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
                <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                  Invoice To:
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {supplierDetails.CompanyName}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {supplierDetails.Address1}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {supplierDetails.Address2 + ' PinCode - ' + supplierDetails.Pincode}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {supplierDetails.city_name + ', ' + supplierDetails.state_name + ', ' + supplierDetails.country_name}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {/* {data.invoice.companyEmail} */}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
                <div>
                  <Typography variant='subtitle2' sx={{ mb: 2.5, color: 'text.primary' }}>
                    GST Details:
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body2'>GST Number:</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body2'>{supplierDetails.GSTNumber}</Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body2'>GSTIN UIN:</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body2'>{supplierDetails.GSTINUIN}</Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body2'>CIN:</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body2'>{supplierDetails.CIN}</Typography>
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        ) : null}

        <Divider sx={{ mb: 1.25 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr no.</TableCell>
                <TableCell>Product</TableCell>

                <TableCell>qty</TableCell>
                <TableCell>price per unit</TableCell>
                <TableCell>subtotal</TableCell>
                <TableCell>tax</TableCell>
                <TableCell>discount</TableCell>

                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billProducts.map((billData, index) => {
                return (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{billData.PName}</TableCell>

                    <TableCell>
                      {billData.Quantity} {billData.Unit}
                    </TableCell>
                    <TableCell>
                      {billData.UnitPrice && displayAmount(billData.UnitPrice)} per {billData.Unit}
                    </TableCell>
                    <TableCell>
                      {billData.UnitPrice &&
                        billData.Quantity &&
                        displayAmount(parseInt(billData.UnitPrice) * parseInt(billData.Quantity))}{' '}
                    </TableCell>
                    <TableCell>{billData.TaxPercent}%</TableCell>
                    <TableCell>{billData.DiscountPercent}%</TableCell>
                    <TableCell>{billData.TotalAmount && displayAmount(billData.TotalAmount)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}></Grid>
            <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <Divider sx={{ mt: 6, mb: 1.5 }} />
              <CalcWrapper>
                <Typography variant='body2'>Total:</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                  {displayAmount(
                    billProducts &&
                      billProducts.reduce((acc, obj) => {
                        return acc + obj.TotalAmount
                      }, 0)
                  )}
                </Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container>
        <Box sx={{ mt: 5, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          {/* <Link href={`/l2/view-bill/print`} passHref>
            <Button sx={{ mr: 4 }} target='_blank' component='a' variant='contained'>
              Print
            </Button>
          </Link> */}

          <ReactToPdf
            scale={0.845}
            targetRef={PreviewRef}
            filename={`invoice-${billDetails && billDetails.Bill_Name}.pdf`}
          >
            {({ toPdf }) => {
              return (
                <Button variant='contained' color='success' onClick={toPdf}>
                  Download
                </Button>
              )
            }}
          </ReactToPdf>
        </Box>
      </Grid>
    </>
  )
}

export default ViewBillComponent
