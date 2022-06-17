// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// ** Server imports
import useUserDetails from "../../hooks/useUserDetails"
import { secureApi } from '../../helpers/apiGenerator'
import api_configs from '../../configs/api_configs'


const CompanyDetails = () => {

  // ** Get Company By Company ID
  const userDetails = useUserDetails()

  const [allStates,setAllStates] = useState([])
  const [allCountries,setAllCountries] = useState([])
  const [allCities,setAllCities] = useState([])
  const [selectedCountry,setSelectedCountry] = useState(allCountries[0])
  const [selectedState,setSelectedState] = useState(allStates[0])
  const [selectedCity,setSelectedCity] = useState(allCities[0])
  const [co_ID,setCoID] = useState(null)
  const [state_ID,setStateID] = useState(null)
  const [city_ID,setCityID] = useState(null)



  const getCompanyByID = async () => {
    console.log("bbbbbbbbbbb")
    await secureApi.get(api_configs.company.getCompanyDetails,{ params: { Co_ID: userDetails.Co_ID } }).then(res => {
      if(res.status === 200){
        setCoID(res.data.companyDetails[0].Country)
        setStateID(res.data.companyDetails[0].State)
        setCityID(res.data.companyDetails[0].City)
      }
    })
  }

  // ** Get Country State and City
  const getCountries = async (Co_ID) => {
    await secureApi.get(api_configs.locality.getCountries).then(res => {
      if(res.status === 200){
        setAllCountries(res.data.countries)
        let selectedcountry = res.data.countries.find((country) => {
          if(Co_ID === country.id)
            return country
        })
        setSelectedCountry(selectedcountry)
      }
    })
  }
  const getStates = async (Co_ID) => {
    console.log(Co_ID,"aaaaaaaaaaaaaaaaaaaaaaa")
    await secureApi.get(api_configs.locality.getStates).then(res => {
      if(res.status === 200){
        let AllStates = res.data.states.filter((state) => {
          if(Co_ID === state.country_id)
            return state
        })
        // console.log(AllStates)
        setAllStates(AllStates)
        console.log(state_ID,"IDDDDD")
        let selectedstate = res.data.states.find((state) => {
          if(state_ID === state.id)
            return state
        })
        if(selectedState === undefined || selectedState === null) setSelectedState(selectedstate)
        else setSelectedState(selectedstate.id === selectedState.id ? null : selectedstate)
        // getCities(state_ID)
      }
    })
  }
  const getCities = async (s_id) => {
    await secureApi.get(api_configs.locality.getCities).then(res => {
      if(res.status === 200){
        let AllCities = res.data.cities.filter((city) => {
          if(s_id === city.state_id)
            return city
        })
        // console.log(AllCities)
        setAllCities(AllCities)
        let selectedcity = res.data.cities.find((city) => {
          if(city_ID === city.id)
            return city
        })
        if(selectedCity === undefined || selectedCity === null) setSelectedCity(selectedcity)
        else setSelectedCity(selectedcity.id === selectedCity.id ? null : selectedcity)
        
      }
    })
  }


  useEffect(() => {
    getCompanyByID()
    if(co_ID){
      getCountries(co_ID)
    }
    if(state_ID){
      getStates(co_ID)
    }
    if(city_ID){
      getCities(state_ID)
    }
  },[co_ID,state_ID,city_ID])

  // ** RegEx for Mobile Number Validation
  const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const poc = yup.object().shape({
    mobile: yup.string().required('This field is required').matches(phoneRegExp, 'Enter a Valid Number').max(10).min(10),
    address: yup.string().required('This field is required'),
    co_email: yup.string().required('This field is required'),
    contact_name: yup.string().required('This field is required'),
    gst_no: yup.string().required('This field is required'),
    gstinuin: yup.string().required('This field is required'),
    cin: yup.string().required('This field is required'),
  })

  const {
    control: userControl,
    formState: { errors: userErrors },
    handleSubmit: handleCompanyDetailSubmit,
  } = useForm({
    resolver: yupResolver(poc)
  })

  const onSubmit = async data => {

    console.log(...data)
  }


  //TODO : Call City array from db

  const [country_id, setCountry_id] = useState(null);

  const [state_id, setState_id] = useState(null);

  const [city_id, setCity_id] = useState(null);

  console.log(country_id,"country", state_id,"state" )

  return (
    <Card>
      <CardHeader title='Update Company Details' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ m: 0 }} />
      <form onSubmit={handleCompanyDetailSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Basic Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='address'
                  control={userControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      sx={{ width: '100%' }}
                      onChange={onChange}
                      error={Boolean(userErrors['address'])}
                      id='address-multiline'
                      label='Address'
                      multiline
                      maxRows={3}
                    />
                  )}
                />
                {userErrors['address'] && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id='country-select'
                sx={{ width: '100%' }}
                value={selectedCountry ? selectedCountry : null}
                onChange={(event, value) => {
                  setSelectedCountry(value)
                  setSelectedState(null)
                  getStates(value.id)
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
                id='state-select'
                sx={{ width: '100%' }}
                value={selectedState ? selectedState : null}
                onChange={(event, value) => {
                  setSelectedState(value)
                  setSelectedCity(null)
                  getCities(value.id)
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
                id='city'
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
                  name='co_email'
                  control={userControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      sx={{ width: '100%' }}
                      onChange={onChange}
                      error={Boolean(userErrors['co_email'])}
                      type='email'
                      label='Email'
                      placeholder='abc@gmail.com'
                    />
                  )}
                />
                {userErrors['co_email'] && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 0 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Point of Contact
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='contact_name'
                  control={userControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      error={Boolean(userErrors['contact_name'])}
                      onChange={onChange}
                      fullWidth
                      label='Contact Name'
                      placeholder='Leonard'
                    />
                  )}
                />
                {userErrors['contact_name'] && (
                  <FormHelperText sx={{ color: 'error.main' }}>
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
                  <FormHelperText sx={{ color: 'error.main' }}>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                3. Company Business Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='gst_no'
                  control={userControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      error={Boolean(userErrors['gst_no'])}
                      onChange={onChange}
                      fullWidth
                      label='GST Number'
                      placeholder='XXXXXXXXXXXXXXXX'
                    />
                  )}
                />
                {userErrors['gst_no'] && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='gstuin'
                  control={userControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      error={Boolean(userErrors['gstuin'])}
                      onChange={onChange}
                      fullWidth
                      label='GST UIN'
                      placeholder='XXXXXXXXXXXXXXXX'
                    />
                  )}
                />
                {userErrors['gstuin'] && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='cin'
                  control={userControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      error={Boolean(userErrors['cin'])}
                      onChange={onChange}
                      fullWidth
                      label='CIN'
                      placeholder='XXXXXXXXXXXXXXXX'
                    />
                  )}
                />
                {userErrors['cin'] && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='logo' label='Logo File Name' placeholder='abc.jpeg' />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

const countries = [
  { id: 1, label: 'India' },
  { id: 2, label: 'Pakistan' },
  { id: 3, label: 'Australia' },
  { id: 4, label: 'Argentina' },
  { id: 5, label: 'Austria' },
  { id: 6, label: 'Barbados' },
  { id: 7, label: 'Brazil' },
]

const country_state = [
  { id: 1, label: 'Maharashtra' },
  { id: 2, label: 'Gujrat' },
  { id: 3, label: 'Rajasthan' },
  { id: 4, label: 'Telangana' },
  { id: 5, label: 'Goa' },
  { id: 6, label: 'Karnataka' },
  { id: 7, label: 'Tamil' },
]

const cities = [
  { id: 1, label: 'Nagpur' },
  { id: 2, label: 'Mumbai' },
  { id: 3, label: 'Jaipur' },
  { id: 4, label: 'Mount-Abu' },
  { id: 5, label: 'Chennai' },
  { id: 6, label: 'Banglore' },
  { id: 7, label: 'Pune' },
]

export default CompanyDetails;
