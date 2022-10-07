// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

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
import Autocomplete from '@mui/material/Autocomplete'

import useUserDetails from '../../hooks/useUserDetails'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { secureApi } from '../../helpers/apiGenerator'
import api_configs from '../../configs/api_configs'

// ** Custom Components Imports
import StepperCustomDot from '../../components/utils/StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    title: 'Create Supplier Company',
    subtitle: 'Enter the Company Details'
  },
  {
    title: 'Create Supplier',
    subtitle: 'Create Supplier Account'
  }
]

const defaultCompanyValues = {
  companyName: '',
  status: '',
  city: '',
  state: '',
  country: '',
  company_address: '',
  company_email: '',
  company_gst: '',
  company_uin: '',
  pincode: ''
}

const defaultUserValues = {
  email: '',
  mobile: '',
  last_name: '',
  first_name: ''
}

const companySchema = yup.object().shape({
  companyName: yup.string().required(),
  status: yup.string().required(),
  company_address: yup.string().required(),
  pincode: yup.string().required(),
  company_email: yup.string().email().required(),
  company_gst: yup.string().required(),
  company_uin: yup.string().required(),
  company_cin: yup.string().required()
})

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const userSchema = yup.object().shape({
  mobile: yup.string().required('This field is required').matches(phoneRegExp, 'Enter a Valid Number').max(10).min(10),
  last_name: yup.string().required(),
  first_name: yup.string().required(),
  email: yup.string().email().required()
})

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const AddSupplier = ({ show, handleClose }) => {
  const userDetails = useUserDetails()

  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const [allCountries, setAllCountries] = useState([])
  const [allStates, setAllStates] = useState([])
  const [allCities, setAllCities] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0])
  const [selectedState, setSelectedState] = useState(allStates[0])
  const [selectedCity, setSelectedCity] = useState(allCities[0])

  // ** Get Data for Form
  const getCountries = async () => {
    await secureApi.get(api_configs.locality.getCountries).then(res => {
      if (res.status === 200) {
        setAllCountries(res.data.countries)
      }
    })
  }

  const getStates = async Co_ID => {
    await secureApi.get(api_configs.locality.getStates).then(res => {
      if (res.status === 200) {
        let AllStates = res.data.states.filter(state => {
          if (Co_ID === state.country_id) return state
        })
        setAllStates(AllStates)

        let selectedstate = res.data.states.find(state => {
          if (state_ID === state.id) return state
        })
        setSelectedState(selectedstate)

        setSFlag(true)

        // if(selectedState === undefined || selectedState === null) setSelectedState(selectedstate)
        // else setSelectedState(selectedstate.id === selectedState.id ? null : selectedstate)
      }
    })
  }

  const getCities = async s_id => {
    await secureApi.get(api_configs.locality.getCities).then(res => {
      if (res.status === 200) {
        let AllCities = res.data.cities.filter(city => {
          if (s_id === city.state_id) return city
        })
        setAllCities(AllCities)

        let selectedcity = res.data.cities.find(city => {
          if (city_ID === city.id) return city
        })
        setSelectedCity(selectedcity)

        setCiFlag(true)

        // if(selectedCity === undefined || selectedCity === null) setSelectedCity(selectedcity)
        // else setSelectedCity(selectedcity.id === selectedCity.id ? null : selectedcity)
      }
    })
  }

  useEffect(() => {
    getCountries()
  }, [])

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
    company: { companyName: '', status: '', country: '', city: '', state: '', company_address: '', company_email: '' }
  })

  const createNewCompany = async data => {
    await secureApi
      .post(api_configs.company.createNew, {
        CompanyName: data.company.companyName,
        status: data.company.status,
        user: userDetails.User_ID,
        companyDetails: {
          Address1: data.company.company_address,
          Address2: '',
          City: selectedCity.id,
          State: selectedState.id,
          Country: selectedCountry.id,
          Pincode: data.company.pincode,
          Email: data.company.company_email1,
          ContactName: '',
          ContactPhone: '',
          GSTNumber: data.company.company_gst,
          GSTINUIN: data.company.company_uin,
          CIN: data.company.company_cin,
          CompanyType: 'Supplier',
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
    await secureApi.post(api_configs.user.create, {
      FirstName: data.user.first_name,
      LastName: data.user.last_name,
      Email: data.user.email,
      MobileNo: data.user.mobile,
      otherDetails: {
        Co_ID: company_id,
        Div_ID: 0,
        Role_ID: 0,
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
        toast.success('Supplier Created Successfully')
        handleClose()
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
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Basic Details
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
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  sx={{ width: '100%' }}
                  value={selectedCountry ? selectedCountry : null}
                  onChange={(event, value) => {
                    setSelectedCountry(value)
                    getStates(value.id)
                    setSelectedState(null)
                  }}
                  options={allCountries}
                  getOptionLabel={option => option.name}
                  renderOption={(props, option) => <Box {...props}>{option.name}</Box>}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name='country'
                      label='Choose a country'
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  sx={{ width: '100%' }}
                  value={selectedState ? selectedState : null}
                  onChange={(event, value) => {
                    setSelectedState(value)
                    getCities(value.id)
                    setSelectedCity(null)
                  }}
                  options={allStates}
                  getOptionLabel={option => option.name}
                  renderOption={(props, option) => <Box {...props}>{option.name}</Box>}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name='state'
                      label='Choose a State'
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  sx={{ width: '100%' }}
                  value={selectedCity ? selectedCity : null}
                  onChange={(event, value) => {
                    setSelectedCity(value)
                  }}
                  options={allCities}
                  getOptionLabel={option => option.name}
                  renderOption={(props, option) => <Box {...props}>{option.name}</Box>}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name='city'
                      label='Choose a City'
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_address'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        multiline
                        value={value}
                        maxRows={4}
                        label='Company Address'
                        onChange={e => {
                          onChange(e)
                        }}
                        placeholder='Plot no XX, Area, Landmark - pincode'
                        error={Boolean(companyErrors.company_address)}
                        aria-describedby='validation-company_address'
                      />
                    )}
                  />
                  {companyErrors.company_address && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_address'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_email'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        value={value}
                        label='Company Email'
                        onChange={e => {
                          onChange(e)
                        }}
                        error={Boolean(companyErrors.company_email)}
                        placeholder='carterleonard@gmail.com'
                        aria-describedby='validation-company_email'
                      />
                    )}
                  />
                  {companyErrors.company_email && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_email'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='pincode'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='text'
                        value={value}
                        label='Pin Code'
                        onChange={e => {
                          onChange(e)
                        }}
                        error={Boolean(companyErrors.pincode)}
                        placeholder='400615'
                        aria-describedby='validation-company_email'
                      />
                    )}
                  />
                  {companyErrors.pincode && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_email'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. GST Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_gst'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label='Company GST Number'
                        value={value}
                        onChange={e => {
                          onChange(e)
                        }}
                        error={Boolean(companyErrors.company_gst)}
                        placeholder='XXXXXXXXXXXXXXXXXXXXXXX'
                        aria-describedby='validation-company_gst'
                      />
                    )}
                  />
                  {companyErrors.company_gst && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_gst'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_uin'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label='Company GST UIN'
                        value={value}
                        onChange={e => {
                          onChange(e)
                        }}
                        error={Boolean(companyErrors.company_uin)}
                        placeholder='xxxxxxxxxx'
                        aria-describedby='validation-company_uin'
                      />
                    )}
                  />
                  {companyErrors.company_uin && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_uin'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_cin'
                    control={companyControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label='Company CIN Number'
                        value={value}
                        onChange={e => {
                          onChange(e)
                        }}
                        error={Boolean(companyErrors.company_cin)}
                        placeholder='XXXXXXXXXXXXXXXXXXXXXXX'
                        aria-describedby='validation-company_cin'
                      />
                    )}
                  />
                  {companyErrors.company_cin && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_cin'>
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
              Add Another Supplier
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Drawer
      open={show}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add New Supplier</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 2 }}>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if ((companyErrors.companyName || companyErrors.status) && activeStep === 0) {
                  labelProps.error = true
                } else if (
                  (userErrors.mobile || userErrors.email || userErrors['last_name'] || userErrors['first_name']) &&
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
        <Divider sx={{ m: 0 }} />

        <CardContent>{renderContent()}</CardContent>
      </Box>
    </Drawer>
  )
}

export default AddSupplier
