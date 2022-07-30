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
import Chip from '@mui/material/Chip'

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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

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
  email: yup.string().email().required(),
  contact: yup
    .number()
    .typeError('Contact Number field is required')
    .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  firstName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  lastName: yup
    .string()
    .min(3, obj => showErrors('Last Name', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  email: '',
  contact: '',
  firstName: '',
  lastName: '',
  division: '',
  role: ''
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const AddNewUser = props => {
  const { open, toggle } = props
  const [role, setRole] = useState('2')
  const [division, setDivision] = useState([])
  const [allDivision, setAllDivision] = useState([])
  const userDetails = useUserDetails()

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

  const getAllDivision = async () => {
    await secureApi.get(api_configs.division.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.data.allDivisions) {
        if (res.data.allDivisions.length > 0) {
          let allDivision = []
          res.data.allDivisions.map(div => {
            allDivision.push({ id: div.Div_ID, label: div.DivisionName })
          })
          setAllDivision(allDivision)
        }
      }
    })
  }

  const addUser = async data => {
    try {
      let addUser = await secureApi.post(api_configs.user.create, {
        MobileNo: data.contact,
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        otherDetails: {
          Role_ID: role,
          divisions: division.length ? division : [0],
          Co_ID: userDetails.Co_ID
        }
      })
      if (addUser) toast.success('Created Successfully')
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  const onSubmit = async data => {
    addUser(data)

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
        <Typography variant='h6'>Add User</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='firstName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='First Name'
                  onChange={onChange}
                  placeholder='Jignesh'
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='lastName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Last Name'
                  onChange={onChange}
                  placeholder='Patel'
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Email'
                  onChange={onChange}
                  placeholder='johndoe@email.com'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Contact'
                  onChange={onChange}
                  placeholder='(397) 294-5153'
                  error={Boolean(errors.contact)}
                />
              )}
            />
            {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              value={role}
              id='select-role'
              label='Select Role'
              labelId='role-select'
              onChange={e => setRole(e.target.value)}
              inputProps={{ placeholder: 'Select Role' }}
            >
              <MenuItem value='2'>L1 User</MenuItem>
              <MenuItem value='3'>L2 User</MenuItem>
              <MenuItem value='4'>L3 User</MenuItem>
            </Select>
          </FormControl>
          {errors.role && <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>}

          { role == '4' ?
          <FormControl fullWidth>
            <InputLabel id='user-divisions-label'>Select Division</InputLabel>
            <Select
              multiple
              label='Select Division'
              value={division}
              MenuProps={MenuProps}
              id='user-divisions'
              onChange={e => {
                setDivision(e.target.value)
              }}
              labelId='user-division-label'
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selected.map(value => {
                    let foundDivision = allDivision.find(div => div.id == value)

                    return <Chip key={value} label={foundDivision.label} sx={{ m: 0.75 }} />
                  })}
                </Box>
              )}
            >
              {allDivision.map((div, index) => (
                <MenuItem key={index} value={div.id}>
                  {div.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl> : null
          }

          {errors.division && <FormHelperText sx={{ color: 'error.main' }}>{errors.division.message}</FormHelperText>}
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: "1rem" }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
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

export default AddNewUser
