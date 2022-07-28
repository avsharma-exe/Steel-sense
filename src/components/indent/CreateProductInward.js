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

const schema = yup.object().shape({
  quantity: yup.number().typeError('Quantity to be ordered is required').required(),
  
})

const defaultValues = {
  quantity: '',
  supplier: '',
  invoice_date: '',
  
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const CreateProductInward = props => {
  const { open, toggle, productDetails } = props
  const [product, setProduct] = useState()
  const [allSuppliers, setAllSuppliers] = useState([])
  const [Supplier, setSupplier] = useState(allSuppliers[0])
  const [product_stock, setProductStock] = useState()
  const userDetails = useUserDetails()
  const [ex_date, setExDate] = useState(new Date())

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
    // addIndent(data)
    // TODO: Add User API CALL
  }

  const handleClose = () => {
    reset()
    toggle()
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
        <Typography variant='h6'>Create Product Inward</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='productName'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={productDetails ? productDetails.PName : ''}
                  disabled
                  // label='Product Name'
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.productName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.productName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='quantity'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  type='number'
                  label='Quantity'
                  onChange={onChange}
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
          <Grid item xs={12} sm={6}  sx={{ mb: 6 }}>
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
                    label='Invoice Date'
                    value={value}
                    onChange={onChange}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.expected_date && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.expected_date.message}</FormHelperText>
            )}
          </FormControl>

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
