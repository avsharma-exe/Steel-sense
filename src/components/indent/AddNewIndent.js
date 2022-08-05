// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
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
  quantity: yup
    .number()
    .typeError('Quantity to be ordered is required')
    .required(),
  description: yup
    .string()
    .required(),

})

const defaultValues = {
  quantity: '',
  description: '',
  expected_date: '',
  current_stock: ''
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const AddNewIndent = props => {
  const { open, toggle, productDetails, updateDashboard } = props
  const [product, setProduct] = useState()
  const [product_stock, setProductStock] = useState()
  const userDetails = useUserDetails()
  const [ex_date, setExDate] = useState(new Date())


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

  const getProductDetails = async () => {
    await secureApi.get(api_configs.product.getProductByID, { params: { product: productDetails.id } }).then(res => {
        if (productDetails.id && res.data.product.length > 0) {
            // console.log(res.data);
          setProduct(res.data.product[0])
          setProductStock(res.data.p_stock[0])
        }
      })
  }

  // const getAllDivision = async () => {
  //   await secureApi.get(api_configs.division.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
  //     if (res.data.allDivisions.length > 0) {
  //       let allDivision = []
  //       res.data.allDivisions.map(div => {
  //         allDivision.push({ id: div.Div_ID, label: div.DivisionName })
  //       })
  //       setAllDivision(allDivision)
  //     }
  //   })
  // }

  const addIndent = async data => {
    data['expected_date'] = ex_date
    data['productName'] = product.PName

    // console.log()
    const body = {
      indent : {
        Co_ID : userDetails.Co_ID,
        Div_ID : userDetails.Div_ID,
        user : userDetails.User_ID
      },
      indent_particulars : {
        Description : data.description,
        P_ID : productDetails.id,
        Quantity : data.quantity,
        CurrentStatus : 0,
        ExpectedDate : data.expected_date.getFullYear() +
        '-' + parseInt(data.expected_date.getMonth() + 1) +
        '-' + data.expected_date.getDate() +
        ' ' + data.expected_date.getHours() +
        ':' + data.expected_date.getMinutes(),
      }
    }
    await secureApi
      .post(api_configs.indent.create, body)
      .then(res => {
        // console.log()
        if (!res.data.error) {
          // console.log('Error aa gaya')
        }
        toggle()
        updateDashboard()
        reset()
      })
  }

  const onSubmit = async data => {
    addIndent(data)

    // TODO: Add User API CALL
  }

  const handleClose = () => {
    reset()
    toggle()
  }

  useEffect(() => {
    if (productDetails) getProductDetails()
  }, [productDetails, open])

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
        <Typography variant='h6'>Create New Indent</Typography>
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
                  value = {productDetails ? productDetails.name : ''}
                  disabled

                  // label='Product Name'
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.productName && <FormHelperText sx={{ color: 'error.main' }}>{errors.productName.message}</FormHelperText>}
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
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='current_stock'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled
                  value={product_stock ? product_stock.CurrentStock : null}
                  type='number'
                  onChange={onChange}
                  error={Boolean(errors.current_stock)}
                />
              )}
            />
            {errors.current_stock && <FormHelperText sx={{ color: 'error.main' }}>{errors.current_stock.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='expected_date'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
                  <DatePicker
                    name= 'expected_date'
                    fullWidth
                    label='Expected Date'
                    value={ex_date}
                    onChange={newValue => setExDate(newValue)}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.expected_date && <FormHelperText sx={{ color: 'error.main' }}>{errors.expected_date.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Description'
                  onChange={onChange}
                  placeholder='This quantity is needed for order - XXXXX and priority is - 1'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
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

export default AddNewIndent

