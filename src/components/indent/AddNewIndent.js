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
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { InputAdornment } from '@mui/material'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  expectedDate: yup.string().required(),
  // productName: yup.string().required(),
  qty: yup.number().required()
})

const defaultValues = {
  expectedDate: '',
  productName: '',
  qty: ''
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const AddNewIndent = props => {
  const { open, toggle, productDetails } = props
  const [role, setRole] = useState('2')
  const [division, setDivision] = useState()
  const [product, setProduct] = useState()
  const [expectedDate, setExpectedDate] = useState(new Date())
  const [allDivision, setAllDivision] = useState([])
  const [productdetails , setProductDetails] = useState(productDetails ? productDetails :  {
    name: ""
  })
  const userDetails = useUserDetails()

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      expectedDate: '',
      productName: productdetails.name,
      qty: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const getProductDetails = async () => {
    await secureApi.get(api_configs.product.getProductByID, { params: { product: productDetails.id } }).then(res => {
      if (productDetails.id && res.data.product.length > 0) {
        console.log(res.data.product[0])
        setProduct(res.data.product[0])
      }
    })
  }

  const getAllDivision = async () => {
    await secureApi.get(api_configs.division.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.data.allDivisions.length > 0) {
        let allDivision = []
        res.data.allDivisions.map(div => {
          allDivision.push({ id: div.Div_ID, label: div.DivisionName })
        })
        setAllDivision(allDivision)
      }
    })
  }

  const addIndent = async data => {
    console.log('data', data, expectedDate)
    // try {
    //   let addUser = await secureApi.post(api_configs.user.create, {
    //     MobileNo: data.contact,
    //     FirstName: data.firstName,
    //     LastName: data.lastName,
    //     Email: data.email,
    //     otherDetails: {
    //       Role_ID: role,
    //       Div_ID: division,
    //       Co_ID: userDetails.Co_ID
    //     }
    //   })
    //   if (addUser) toast.success('Created Successfully')
    // } catch (e) {
    //   toast.error('Something went wrong')
    // }
  }

  const onSubmit = async data => {
    addIndent(data)

    // TODO: Add User API CALL
    toggle()
    reset()
  }

  const handleClose = () => {
    setRole('2')
    toggle()
    reset()
  }

  useEffect(() => {
    
    getAllDivision()
  }, [])

  useEffect(() => {
    console.log('expected Date', expectedDate)
  }, [expectedDate])

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
              rules={{ required: true }}
              render={({ field: { value, onChange } }) =>
                productDetails ? (
                  <TextField
                    value={product && product.PName}
                    disabled
                    // label='Product Name'
                    onChange={onChange}
                    placeholder=''
                    error={Boolean(errors.productName)}
                  />
                ) : (
                  <TextField
                    value={value}
                    disabled
                    // label='Product Name'
                    onChange={onChange}
                    placeholder=''
                    error={Boolean(errors.productName)}
                  />
                )
              }
            />
            {errors.productName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.productName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='qty'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Quantity'
                  onChange={onChange}
                  placeholder='100'
                  error={Boolean(errors.qty)}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{product && product.UnitName}</InputAdornment>
                  }}
                />
              )}
            />
            {errors.qty && <FormHelperText sx={{ color: 'error.main' }}>{errors.qty.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='expectedDate'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    openTo='day'
                    // disableFuture
                    label='Expected Date'
                    value={expectedDate}
                    views={['year', 'month', 'day']}
                    onChange={e => setExpectedDate(e)}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.expectedDate && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.expectedDate.message}</FormHelperText>
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

export default AddNewIndent

// <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
//                   <TextField
//                     value={value}
//                     label='Quantity'
//                     onChange={onChange}
//                     placeholder='100'
//                     error={Boolean(errors.qty)}
//                   />
//                   <FormControl fullWidth sx={{ borderLeft: '0px' }}>
//                     <InputLabel id='Unit'>Unit</InputLabel>
//                     <Select
//                       fullWidth
//                       // value={role}
//                       id='select-unit'
//                       labelId='unit-select'
//                       label='Unit'
//                       onChange={e => setRole(e.target.value)}
//                       inputProps={{ placeholder: 'Select Unit' }}
//                     >
//                       <MenuItem value='2'>Kg</MenuItem>
//                       <MenuItem value='3'>Tonnes</MenuItem>
//                       <MenuItem value='4'>Litres</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
