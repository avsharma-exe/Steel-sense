// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import * as yup from 'yup'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Server imports
import useUserDetails from '../hooks/useUserDetails'
import { secureApi } from '../helpers/apiGenerator'
import api_configs from '../configs/api_configs'

const defaultValues = {
  first_name: '',
  last_name: '',
  mobile: '',
  email: ''
}

const UserProfile = () => {
  // ** Get User Details
  const userDetails = useUserDetails()

  // ** States
  const [loading, setLoading] = useState(false)

  // setter for selected items

  const [selectedFname, setSelectedFname] = useState(userDetails.FirstName)
  const [selectedLname, setSelectedLname] = useState(userDetails.LastName)
  const [selectedEmail, setSelectedEmail] = useState(userDetails.Email)
  const [selectedMobile, setSelectedMobile] = useState(userDetails.MobileNo)

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: userDetails.FirstName,
      last_name: userDetails.LastName,
      mobile: userDetails.MobileNo,
      email: userDetails.Email
    },
    resolver: yupResolver(
      yup.object().shape({
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        mobile: yup.string().required(),
        email: yup.string().required()
      })
    )
  })

  const onSubmit = async data => {
    await secureApi
      .patch(api_configs.user.update, {
        FirstName: data.first_name,
        LastName: data.last_name,
        Email: data.email,
        MobileNo: data.mobile,
        User_ID: userDetails.User_ID
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Form Submitted')
        } else {
          toast.error('Form is Not Submitted')
        }
      })
  }

  // useEffect(() => {}, [])

  return (
    <Card>
      <CardHeader title='Edit User Profile' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                User Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='first_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={selectedFname ? selectedFname : null}
                      label='First Name'
                      onChange={e => {
                        onChange(e)
                        setSelectedFname(e.target.value)
                      }}
                      placeholder='Ayush'
                      error={Boolean(errors.first_name)}
                      aria-describedby='validation-first_name'
                    />
                  )}
                />
                {errors.first_name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-first_name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='last_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={selectedLname ? selectedLname : null}
                      label='Last Name'
                      onChange={e => {
                        onChange(e)
                        setSelectedLname(e.target.value)
                      }}
                      placeholder='Sharma'
                      error={Boolean(errors.last_name)}
                      aria-describedby='validation-last_name'
                    />
                  )}
                />
                {errors.last_name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-last_name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='email'
                      value={selectedEmail ? selectedEmail : null}
                      label='Email'
                      onChange={e => {
                        onChange(e)
                        setSelectedEmail(e.target.value)
                      }}
                      error={Boolean(errors.email)}
                      placeholder='carterleonard@gmail.com'
                      aria-describedby='validation-email'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-email'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='mobile'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={selectedMobile ? selectedMobile : null}
                      label='Mobile Number'
                      onChange={e => {
                        onChange(e)
                        setSelectedMobile(e.target.value)
                      }}
                      error={Boolean(errors.mobile)}
                      placeholder='xxxxxxxxxx'
                      aria-describedby='validation-poc_mobile'
                    />
                  )}
                />
                {errors.mobile && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-poc_mobile'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button size='large' type='submit' variant='contained'>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserProfile
