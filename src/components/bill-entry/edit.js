// ** React Imports
import { useState, forwardRef } from 'react'

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

const Edit = props => {
  // ** Props
  const { invoiceNumber, companyDetails, billDetails, toggleAddCustomerDrawer, viewBillData, setViewBillData } = props

  // ** States

  const [dueDate, setDueDate] = useState(new Date(tomorrowDate))

  // ** Hook
  const theme = useTheme()

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
  }

  const handleAddNewCustomer = () => {
    toggleAddCustomerDrawer()
  }

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
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
          <Grid item xl={6} xs={12}>
            <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h6' sx={{ mr: 1, width: '105px' }}>
                    Invoice
                  </Typography>
                  <TextField
                    size='small'
                    value={invoiceNumber}
                    sx={{ width: { sm: '250px', xs: '170px' } }}
                    InputProps={{
                      disabled: true,
                      startAdornment: <InputAdornment position='start'>#</InputAdornment>
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                    Date Due:
                  </Typography>
                  <DatePicker
                    id='due-date'
                    selected={viewBillData.dueDate}
                    customInput={<CustomInput />}
                    onChange={date => setViewBillData({ ...viewBillData, dueDate: date })}
                  />
                </Box>
              </Box>
            </DatePickerWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mt: 1, mb: 1 }} />

      <CardContent sx={{ pb: 2 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
              Invoice To:
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {billDetails.CompanyName}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {billDetails.Address1}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {billDetails.Address2 + ' PinCode - ' + billDetails.Pincode}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {billDetails.city_name + ', ' + billDetails.state_name + ', ' + billDetails.country_name}
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
                        <Typography variant='body2'>{billDetails.GSTNumber}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>GSTIN UIN:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{billDetails.GSTINUIN}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>CIN:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{billDetails.CIN}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mb: 1.25 }} />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>

              <TableCell>qty</TableCell>
              <TableCell>price per unit</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{billDetails.PName}</TableCell>

              <TableCell>
                {billDetails.Quantity} {billDetails.Unit}
              </TableCell>
              <TableCell>
              ₹{billDetails.UnitPrice && displayAmount(billDetails.UnitPrice)} per {billDetails.Unit}
              </TableCell>
              <TableCell>₹{billDetails.TotalAmount && displayAmount(billDetails.TotalAmount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}></Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant='body2'>Subtotal:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                ₹{billDetails.TotalAmount && displayAmount(billDetails.TotalAmount)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Discount:</Typography>
              <TextField
                size='small'
                value={viewBillData.discount}
                onChange={e => setViewBillData({ ...viewBillData, discount: e.target.value })}
                type='number'
                sx={{ width: '100px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>%</InputAdornment>
                }}
              />
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Tax:</Typography>
              <TextField
                size='small'
                value={viewBillData.tax}
                onChange={e => setViewBillData({ ...viewBillData, tax: e.target.value })}
                type='number'
                sx={{ width: '100px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>%</InputAdornment>
                }}
              />
            </CalcWrapper>
            <Divider sx={{ mt: 6, mb: 1.5 }} />
            <CalcWrapper>
              <Typography variant='body2'>Total:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
              ₹{billDetails.TotalAmount && displayAmount(billDetails.TotalAmount - (billDetails.TotalAmount * viewBillData.tax / 100) - (billDetails.TotalAmount * viewBillData.discount / 100))}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: 1 }} />

      <CardContent sx={{ pt: 4 }}>
        {/* <InputLabel htmlFor='invoice-note'>Note:</InputLabel>
        <TextField
          rows={2}
          fullWidth
          multiline
          id='invoice-note'
          sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
          defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
        />*/}
      </CardContent>
    </Card>
  )
}

export default Edit
