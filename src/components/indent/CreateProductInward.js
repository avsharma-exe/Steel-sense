// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'

import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import useUserDetails from 'src/hooks/useUserDetails'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { useEffect } from 'react'
import { InputAdornment } from '@mui/material'
import { Console } from 'mdi-material-ui'

const schema = yup.object().shape({})

const defaultValues = {
  quantity: 0,
  discount: 0,
  tax: 0,
  taxRate: 0,
  unitPrice: 0,
  supplier: 0,
  invoice_date: 0
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const CreateProductInward = props => {
  const { open, toggle, productDetails, close } = props
  const [product, setProduct] = useState(productDetails)
  const [allSuppliers, setAllSuppliers] = useState([])
  const [Supplier, setSupplier] = useState(allSuppliers[0])
  const [product_stock, setProductStock] = useState()
  const userDetails = useUserDetails()
  const [ex_date, setExDate] = useState(new Date())

  const [inwardDetails, setInwardDetails] = useState({
    total: 0,
    subtotal: 0,
    taxrate: 0,
    rate: 0,
    discount: 0,
    unitPrice: 0,
    tax: 0
  })

  const getSuppliers = async () => {
    await secureApi.get(api_configs.supplier.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.status === 200) {
        setAllSuppliers(res.data.allCompanies)
      }
    })
  }

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    console.log(data)

    const createPurchaseOrder = await secureApi.post(api_configs.indent.createPurchaseOrder, {
      Co_ID: userDetails.Co_ID,
      Div_ID: productDetails.Div_ID,
      P_ID: productDetails.P_ID,
      Supplier_ID: Supplier.Co_ID,
      Quantity: inwardDetails.quantity,
      indent: productDetails.indent_particulars_id,
      ExpectedDate:
        data.invoice_date.getDate() + '-' + (data.invoice_date.getMonth() + 1) + '-' + data.invoice_date.getFullYear(),
      inward: {
        status: 0,
        UnitPrice: inwardDetails.unitPrice,
        DiscountPercent: inwardDetails.discount,
        TaxPercent: inwardDetails.tax,
        TotalAmount:
          (parseInt(inwardDetails.tax) / 100) * (parseInt(product.Quantity) * inwardDetails.unitPrice) +
          parseInt(product.Quantity) * inwardDetails.unitPrice -
          (((parseInt(inwardDetails.tax) / 100) * (parseInt(product.Quantity) * inwardDetails.unitPrice) +
            parseInt(product.Quantity) * inwardDetails.unitPrice) *
            inwardDetails.discount) /
            100
      }
    })

    if(createPurchaseOrder.status === 200) {
      toggle()
    }
  }

  const handleClose = () => {
    reset()
    close()
  }

  useEffect(() => {
    getSuppliers()
  }, [])
  

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Create Purchase Order</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography sx={{ mb: 6 }}>
            <b>Product - </b>
            <span style={{ fontSize: '20px' }}>{productDetails ? productDetails.PName : ''}</span>
          </Typography>
          <Typography sx={{ mb: 6 }}>
            <b>Division - </b>
            <span style={{ fontSize: '20px' }}>{productDetails ? productDetails.DivisionName : ''}</span>
          </Typography>

          <Grid item xs={12} sm={6} sx={{ mb: 6 }}>
            <Autocomplete
              value={Supplier ? Supplier : null}
              onChange={(event, value) => {
                setSupplier(value)
              }}
              options={allSuppliers}
              getOptionLabel={option => option.CompanyName}
              renderOption={(props, option) => <Box {...props}>{option.CompanyName}</Box>}
              renderInput={params => (
                <TextField
                  {...params}
                  name='Supplier'
                  label='Choose a Supplier'
                  inputProps={{
                    ...params.inputProps
                  }}
                />
              )}
            />
          </Grid>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='invoice_date'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
                  <DatePicker
                    name='invoice_date'
                    fullWidth
                    // label='Expected Date'
                    value={product.ExpectedDate ? new Date(product.ExpectedDate) : new Date(productDetails.ExpectedDate)}
                    onChange={(e) => {
                      console.log(e)
                      onChange(e)
                      setProduct({...product, ExpectedDate: e})

                    }}
                    renderInput={params => <TextField {...params}  />}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.expected_date && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.expected_date.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='quantity'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={product ? product.Quantity : ''}
                  type='number'
                  label='Quantity'
                  onChange={e => {
                    onChange(e)
                    setProduct({ ...product, Quantity: e.target.value })
                    setInwardDetails({ ...inwardDetails, quantity: e.target.value })
                  }}
                  placeholder='10'
                  error={Boolean(errors.quantity)}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{product && product.UnitName}</InputAdornment>
                  }}
                />
              )}
            />
            {errors.quantity && <FormHelperText sx={{ color: 'error.main' }}>{errors.quantity.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='unit_price'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  type='number'
                  label='Unit Price'
                  onChange={e => {
                    onChange(e)
                    console.log(parseInt(product.Quantity) * e.target.value)
                    setInwardDetails({ ...inwardDetails, unitPrice: e.target.value })
                  }}
                  placeholder='10'
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>₹</InputAdornment>
                  }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='tax'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  type='number'
                  label='Tax'
                  onChange={e => {
                    onChange(e)
                    setInwardDetails({
                      ...inwardDetails,
                      tax: e.target.value
                    })
                  }}
                  placeholder='10'
                  error={Boolean(errors.tax)}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>%</InputAdornment>
                  }}
                />
              )}
            />
            {errors.tax && <FormHelperText sx={{ color: 'error.main' }}>{errors.tax.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='discount'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  type='number'
                  label='Discount'
                  onChange={e => {
                    onChange(e)
                    setInwardDetails({ ...inwardDetails, discount: e.target.value })
                  }}
                  placeholder='10'
                  error={Boolean(errors.discount)}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>%</InputAdornment>
                  }}
                />
              )}
            />
            {errors.discount && <FormHelperText sx={{ color: 'error.main' }}>{errors.discount.message}</FormHelperText>}
          </FormControl>

          <Typography sx={{ mb: 6 }}>
            <b>Sub Total - </b>
            <span style={{ fontSize: '20px' }}>{parseInt(product.Quantity) * inwardDetails.unitPrice}</span>
          </Typography>

          <Typography sx={{ mb: 6 }}>
            <b>Tax Rate - </b>
            <span style={{ fontSize: '20px' }}>
              {(parseInt(inwardDetails.tax) / 100) * (parseInt(product.Quantity) * inwardDetails.unitPrice)}
            </span>
          </Typography>

          <Typography sx={{ mb: 6 }}>
            <b>Total - </b>
            <span style={{ fontSize: '20px' }}>
              {(parseInt(inwardDetails.tax) / 100) * (parseInt(product.Quantity) * inwardDetails.unitPrice) +
                parseInt(product.Quantity) * inwardDetails.unitPrice -
                (((parseInt(inwardDetails.tax) / 100) * (parseInt(product.Quantity) * inwardDetails.unitPrice) +
                  parseInt(product.Quantity) * inwardDetails.unitPrice) *
                  inwardDetails.discount) /
                  100}
            </span>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Save
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default CreateProductInward
