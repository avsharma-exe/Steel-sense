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
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'

// ** Icon Imports
import Plus from 'mdi-material-ui/Plus'
import Close from 'mdi-material-ui/Close'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'

// ** Helpers
import displayAmount from 'src/helpers/displayAmount'

// ** Styles
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(5.5),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(12)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))
const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const Add = props => {
  // ** Props
  const {
    clients,
    invoiceNumber,
    selectedClient,
    setSelectedClient,
    toggleAddCustomerDrawer,
    companyDetails,
    products
  } = props

  // ** States
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState('')
  const [issueDate, setIssueDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date(tomorrowDate))
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, settotal] = useState(0)

  const [productList, setProductList] = useState([
    {
      product: {},
      qty: 0,
      pricePerPiece: 0,
      total: 0
    }
  ])

  // ** Hook
  const theme = useTheme()

  // ** Deletes form
  const deleteForm = e => {
    e.preventDefault()
    setCount(count === 1 ? 1 : count - 1)
    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      console.log(clients.filter(i => i.Co_ID === event.target.value))
      setSelectedClient(clients.filter(i => i.Co_ID === event.target.value)[0])
    }
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
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                    Date Issued:
                  </Typography>
                  <DatePicker
                    id='issue-date'
                    selected={issueDate}
                    customInput={<CustomInput />}
                    onChange={date => setIssueDate(date)}
                  />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                    Date Due:
                  </Typography>
                  <DatePicker
                    id='due-date'
                    selected={dueDate}
                    customInput={<CustomInput />}
                    onChange={date => setDueDate(date)}
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
            <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary' }}>
              Invoice To:
            </Typography>
            <Select size='small' value={selected} onChange={handleInvoiceChange} sx={{ mb: 4, width: '200px' }}>
              {/* ** TODO: Add Supplier Drawer Form ** */}
              {/* <CustomSelectItem value=''>
                <Button
                  fullWidth
                  size='small'
                  color='success'
                  onClick={handleAddNewCustomer}
                  startIcon={<Plus fontSize='small' />}
                  sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                >
                  Add New Customer
                </Button>
              </CustomSelectItem> */}
              {clients &&
                clients.map(client => (
                  <MenuItem key={client.CompanyName} value={client.Co_ID}>
                    {client.CompanyName}
                  </MenuItem>
                ))}
            </Select>
            {selectedClient !== null && selectedClient !== undefined ? (
              <Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {selectedClient.CompanyName}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {selectedClient.Address1}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {selectedClient.Address2 + ' PinCode - ' + selectedClient.Pincode}
                </Typography>
                {/* <Typography variant='body2' sx={{ mb: 2 }}>
                  {selectedClient.city_name + ', ' + selectedClient.state_name + ', ' + selectedClient.country_name}
                </Typography> */}
              </Box>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
            {selectedClient !== null && selectedClient !== undefined ? (
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
                          <Typography variant='body2'>{selectedClient.GSTNumber}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>GSTIN UIN:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{selectedClient.GSTINUIN}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>CIN:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{selectedClient.CIN}</Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mb: 1.25 }} />

      <RepeaterWrapper>
        <Repeater count={count}>
          {i => {
            const Tag = i === 0 ? Box : Collapse

            return (
              <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                <Grid container>
                  <RepeatingContent item xs={12}>
                    <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                      <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Item
                        </Typography>
                        <Autocomplete
                          value={productList[i] && productList[i].product.PName}
                          onChange={(event, value) => {
                            setProductList(current =>
                              current.map((obj, index) => {
                                if (index === i) {
                                  return { ...obj, product: value }
                                }

                                return obj
                              })
                            )
                          }}
                          options={products}
                          getOptionLabel={option => option.PName}
                          renderOption={(props, option) => <Box {...props}>{option.PName}</Box>}
                          renderInput={params => (
                            <TextField
                              {...params}
                              name='Product'
                              label='Choose a Product'
                              inputProps={{
                                ...params.inputProps
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Qty
                        </Typography>
                        <TextField
                          size='small'
                          type='number'
                          placeholder='24'
                          onChange={e => {
                            setProductList(current =>
                              current.map((obj, index) => {
                                if (index === i) {
                                  return {
                                    ...obj,
                                    qty: e.target.value,
                                    total: obj.pricePerPiece * e.target.value
                                  }
                                }
                                return obj
                              })
                            )
                          }}
                          defaultValue='24'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                {productList[i] && productList[i].product.Unit}
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Price per Unit
                        </Typography>
                        <TextField
                          size='small'
                          type='number'
                          onChange={e => {
                            setProductList(current =>
                              current.map((obj, index) => {
                                if (index === i) {
                                  return {
                                    ...obj,
                                    pricePerPiece: e.target.value,
                                    total: e.target.value * obj.qty
                                  }
                                }
                                return obj
                              })
                            )
                          }}
                          placeholder='1'
                          defaultValue='1'
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Total Price
                        </Typography>
                        <Typography variant='body2'>{displayAmount(productList[i] && productList[i].total)}</Typography>
                      </Grid>
                    </Grid>
                    <InvoiceAction>
                      <IconButton
                        size='small'
                        onClick={e => {
                          deleteForm(e)
                          setProductList(current =>
                            current.filter((obj, index) => {
                              return index !== i
                            })
                          )
                        }}
                      >
                        <Close fontSize='small' />
                      </IconButton>
                    </InvoiceAction>
                  </RepeatingContent>
                </Grid>
              </Tag>
            )
          }}
        </Repeater>

        <Grid container sx={{ mt: 4.75 }}>
          <Grid item xs={12} sx={{ px: 0 }}>
            <Button
              size='small'
              variant='contained'
              startIcon={<Plus fontSize='small' />}
              onClick={() => {
                setProductList(current => [
                  ...current,
                  {
                    product: {},
                    qty: 0,
                    pricePerPiece: 0,
                    total: 0
                  }
                ])
                setCount(count + 1)
              }}
            >
              Add Item
            </Button>
          </Grid>
        </Grid>
      </RepeaterWrapper>

      <Divider />

      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}></Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant='body2'>Subtotal:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {displayAmount(
                  productList.reduce((acc, product) => {
                    return acc + product.total
                  }, 0)
                )}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Tax:</Typography>
              <TextField
                size='small'
                value={tax}
                onChange={e => setTax(e.target.value)}
                type='number'
                sx={{ width: '100px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>%</InputAdornment>
                }}
              />
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Discount:</Typography>
              <TextField
                size='small'
                value={discount}
                onChange={e => setDiscount(e.target.value)}
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
                {displayAmount(
                  productList.reduce((acc, product) => {
                    return acc + product.total
                  }, 0) -
                    (productList.reduce((acc, product) => {
                      return acc + product.total
                    }, 0) *
                      discount) /
                      100 +
                    (productList.reduce((acc, product) => {
                      return acc + product.total
                    }, 0) *
                      tax) /
                      100
                )}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: 1 }} />

      
    </Card>
  )
}

export default Add
