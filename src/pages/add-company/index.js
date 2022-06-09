// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { secureApi } from '../../helpers/apiGenerator'
import api_paths from '../../configs/api_configs'
// ** Custom Components Imports
import StepperCustomDot from '../../components/utils/StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    title: 'Create Company',
    subtitle: 'Enter the Company Details'
  },
  {
    title: 'Create User',
    subtitle: 'Add User Information'
  }
]

const defaultCompanyValues = {
  companyName: '',
  status: ''
}

const defaultUserValues = {
  email: '',
  mobile: '',
  last_name: '',
  first_name: ''
}

const companySchema = yup.object().shape({
  companyName: yup.string().required(),
  status: yup.string().required()
})

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const userSchema = yup.object().shape({
  mobile: yup.string().required('This field is required').matches(phoneRegExp, 'Enter a Valid Number').max(10).min(10),
  last_name: yup.string().required(),
  first_name: yup.string().required(),
  email: yup.string().email().required()
})

// Main Component
const AddCompany = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  // ** Hooks
  const {
    reset: companyReset,
    control: companyControl,
    handleSubmit: handleCompanySubmit,
    formState: { errors: companyErrors }
  } = useForm({
    defaultValues: defaultCompanyValues,
    resolver: yupResolver(companySchema)
  })

  const {
    reset: userReset,
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors }
  } = useForm({
    defaultValues: defaultUserValues,
    resolver: yupResolver(userSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    companyReset({ companyName: '', status: '' })
    userReset({ email: '', mobile: '', last_name: '', first_name: '' })
  }

  const [companyDetails, setCompanyDetails] = useState({
    // user: { email: '', mobile: '', last_name: '', first_name: '' },
    company: { companyName: '', status: '' }
  })

  const createNewCompany = async data => {
    await secureApi
      .post(api_paths.company.createNew, {
        CompanyName: data.company.companyName,
        status: data.company.status,
        companyDetails: {
          Address1: '',
          Address2: '',
          City: 1,
          State: 1,
          Country: 1,
          Pincode: 123456,
          Email: '',
          ContactName: '',
          ContactPhone: '',
          GSTNumber: '',
          GSTINUIN: '',
          CIN: '',
          CompanyType: '',
          LogoFileName: ''
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          createNewUser(resp.data.result.insertId, data)
        }
      })
  }

  const createNewUser = async (company_id, data) => {
    await secureApi.post(api_paths.user.create, {
      FirstName: data.user.first_name,
      LastName: data.user.last_name,
      Email: data.user.email,
      MobileNo: data.user.mobile,
      otherDetails: {
        Co_ID: company_id,
        Div_ID: 0,
        Role_ID: 1,
        status: 50
      }
    })
  }

  const onSubmit = async data => {
    setActiveStep(activeStep + 1)
    if (activeStep === 0) setCompanyDetails({ ...companyDetails, company: data })

    if (activeStep === steps.length - 1) {
      const formData = {
        company: companyDetails.company,
        user: data
      }
      if (createNewCompany(formData)) {
        toast.success('Form Submitted')
        
      }
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleCompanySubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='companyName'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Company Name'
                        onChange={onChange}
                        placeholder='carterLeonard'
                        error={Boolean(companyErrors.companyName)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {companyErrors.companyName && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    id='stepper-linear-personal-country'
                    error={Boolean(companyErrors.status)}
                    htmlFor='stepper-linear-personal-country'
                  >
                    Status
                  </InputLabel>
                  <Controller
                    name='status'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label='Status'
                        onChange={onChange}
                        error={Boolean(companyErrors.status)}
                        labelId='stepper-linear-personal-country'
                        aria-describedby='stepper-linear-personal-country-helper'
                      >
                        <MenuItem value='0'>Draft</MenuItem>
                        <MenuItem value='50'>Active</MenuItem>
                        <MenuItem value='99'>Inactive</MenuItem>
                      </Select>
                    )}
                  />
                  {companyErrors.status && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-country-helper'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' disabled>
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handleUserSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='first_name'
                    control={userControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='First Name'
                        onChange={onChange}
                        placeholder='Leonard'
                        error={Boolean(userErrors['first_name'])}
                        aria-describedby='stepper-linear-personal-first-name'
                      />
                    )}
                  />
                  {userErrors['first_name'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-first-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='last_name'
                    control={userControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Last Name'
                        onChange={onChange}
                        placeholder='Carter'
                        error={Boolean(userErrors['last_name'])}
                        aria-describedby='stepper-linear-personal-last-name'
                      />
                    )}
                  />
                  {userErrors['last_name'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-last-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='mobile'
                    control={userControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Mobile No.'
                        onChange={onChange}
                        placeholder='8888888888'
                        error={Boolean(userErrors['mobile'])}
                        aria-describedby='stepper-linear-personal-last-name'
                      />
                    )}
                  />
                  {userErrors['mobile'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-last-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='email'
                    control={userControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Email'
                        onChange={onChange}
                        placeholder='abc@gmail.com'
                        error={Boolean(userErrors['email'])}
                        aria-describedby='stepper-linear-personal-last-name'
                      />
                    )}
                  />
                  {userErrors['email'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-last-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )

      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Add Another User
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if ((companyErrors.companyName || companyErrors.status) && activeStep === 0) {
                  labelProps.error = true
                } else if (
                  (userErrors.mobile ||
                    userErrors.email ||
                    userErrors['last_name'] ||
                    userErrors['first_name']) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>0{index + 1}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: 0 }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default AddCompany
