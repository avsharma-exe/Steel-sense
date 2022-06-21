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

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Server imports
import useUserDetails from "../../hooks/useUserDetails"
import { secureApi } from '../../helpers/apiGenerator'
import api_configs from '../../configs/api_configs'


const defaultValues = {
  company_email: '',
  company_address: '',
  poc_name: '',
  poc_mobile: '',
  compnay_gst: '',
  company_uin: '',
  company_cin: '',
  company_logo: '',
}

const CompanyDetails = () => {

  // ** Get Company By Company ID
  const userDetails = useUserDetails()

  const getCompanyByID = async () => {
    setLoading(true)
    await secureApi.get(api_configs.company.getCompanyDetails,{ params: { Co_ID: userDetails.Co_ID } }).then(res => {
      if(res.status === 200){
        console.log(res.data)
        setSelectedAddress(res.data.companyDetails[0].Address1 + "\n" + res.data.companyDetails[0].Address2 )
        setSelectedEmail(res.data.companyDetails[0].Email)
        setSelectedPocName(res.data.companyDetails[0].ContactName)
        setSelectedPocPhone(res.data.companyDetails[0].ContactPhone)
        setSelectedGST(res.data.companyDetails[0].GSTNumber)
        setSelectedUIN(res.data.companyDetails[0].GSTINUIN)
        setSelectedCIN(res.data.companyDetails[0].CIN)
        setSelectedLogo(res.data.companyDetails[0].LogoFileName)
        setCoID(res.data.companyDetails[0].Country)
        setStateID(res.data.companyDetails[0].State)
        setCityID(res.data.companyDetails[0].City)
        setSelectedPincode(res.data.companyDetails[0].Pincode)
      }
    })
    setLoading(false)
  }

  const getCountries = async (Co_ID) => {
    await secureApi.get(api_configs.locality.getCountries).then(res => {
      if(res.status === 200){
        setAllCountries(res.data.countries)
        let selectedcountry = res.data.countries.find((country) => {
          if(Co_ID === country.id)
            return country
        })
        if(!c_flag)
        setSelectedCountry(selectedcountry)
        setCFlag(true)

      }
    })
  }

  const getStates = async (Co_ID) => {
    await secureApi.get(api_configs.locality.getStates).then(res => {
      if(res.status === 200){
        let AllStates = res.data.states.filter((state) => {
          if(Co_ID === state.country_id)
            return state
        })
        setAllStates(AllStates)

        if(!s_flag){
          let selectedstate = res.data.states.find((state) => {
            if(state_ID === state.id)
              return state
          })
          setSelectedState(selectedstate)
        }
        setSFlag(true)
        // if(selectedState === undefined || selectedState === null) setSelectedState(selectedstate)
        // else setSelectedState(selectedstate.id === selectedState.id ? null : selectedstate)
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
        setAllCities(AllCities)
        if(!ci_flag){
          let selectedcity = res.data.cities.find((city) => {
            if(city_ID === city.id)
              return city
          })
          setSelectedCity(selectedcity)
        }
        setCiFlag(true)
        // if(selectedCity === undefined || selectedCity === null) setSelectedCity(selectedcity)
        // else setSelectedCity(selectedcity.id === selectedCity.id ? null : selectedcity)
      }
    })
  }

  // ** Flag for locality setter
  const [c_flag, setCFlag] = useState(false)
  const [s_flag, setSFlag] = useState(false)
  const [ci_flag, setCiFlag] = useState(false)

  // ** States
  const [loading, setLoading] = useState(false)
  // Id's for country state and city
  const [co_ID,setCoID] = useState(null)
  const [state_ID,setStateID] = useState(null)
  const [city_ID,setCityID] = useState(null)
  //  setter for state country and city data
  const [allCountries,setAllCountries] = useState([])
  const [allStates,setAllStates] = useState([])
  const [allCities,setAllCities] = useState([])
  // setter for selected items
  const [selectedCountry,setSelectedCountry] = useState(allCountries[0])
  const [selectedState,setSelectedState] = useState(allStates[0])
  const [selectedCity,setSelectedCity] = useState(allCities[0])
  const [selectedAddress,setSelectedAddress] = useState(null)
  const [selectedEmail,setSelectedEmail] = useState(null)
  const [selectedPocName,setSelectedPocName] = useState(null)
  const [selectedPocPhone,setSelectedPocPhone] = useState(null)
  const [selectedGST,setSelectedGST] = useState(null)
  const [selectedUIN,setSelectedUIN] = useState(null)
  const [selectedCIN,setSelectedCIN] = useState(null)
  const [selectedLogo,setSelectedLogo] = useState(null)
  const [selectedPincode,setSelectedPincode] = useState(null)



  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })


  const onSubmit = async () => {
    await secureApi.patch(api_configs.company.updateCompanyDetails, {
      Address1 : selectedAddress,
      CIN: selectedCIN,
      City: selectedCity.id,
      ContactName: selectedPocName,
      ContactPhone: selectedPocPhone,
      Country: selectedCountry.id,
      Email: selectedEmail,
      GSTINUIN: selectedUIN,
      GSTNumber: selectedGST,
      LogoFileName: selectedLogo,
      Pincode: selectedPincode,
      State: selectedState.id,
      user: userDetails.User_ID,
      company_ID: userDetails.Co_ID,
    })
    .then(resp => {
      if (resp.status === 200) {
        toast.success('Form Submitted')
      }
    })
  }

  useEffect(() => {
    if(!co_ID)
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

  return (
    <Card>
      <CardHeader title='Edit Company Details' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {loading ? (
          <CircularProgress
            sx={{
              color: 'common.black',
              width: '20px !important',
              height: '20px !important',
              mr: theme => theme.spacing(2)
            }}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Basic Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        multiline
                        maxRows={4}
                        value={selectedAddress ? selectedAddress : null}
                        label='Company Address'
                        onChange={ (e)=>{
                          onChange(e)
                          setSelectedAddress(e.target.value)
                        }}
                        placeholder='Plot no XX, Area, Landmark - pincode'
                        error={Boolean(errors.company_address)}
                        aria-describedby='validation-company_address'
                      />
                    )}
                  />
                  {errors.company_address && (
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
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        value={selectedEmail ? selectedEmail : null}
                        label='Company Email'
                        onChange={(e)=>{
                          onChange(e)
                          setSelectedEmail(e.target.value)
                        }}
                        error={Boolean(errors.company_email)}
                        placeholder='carterleonard@gmail.com'
                        aria-describedby='validation-company_email'
                      />
                    )}
                  />
                  {errors.company_email && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_email'>
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
                    setSelectedCountry(selectedEmail)
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
                    name='pin_code'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        multiline
                        maxRows={4}
                        value={selectedPincode ? selectedPincode : null}
                        label='Pincode'
                        onChange={ (e)=>{
                          onChange(e)
                          setSelectedPincode(e.target.value)
                        }}
                        placeholder='******'
                        error={Boolean(errors.pin_code)}
                        aria-describedby='validation-pin_code'
                      />
                    )}
                  />
                  {errors.pin_code && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-pin_code'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. POC Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='poc_name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={selectedPocName ? selectedPocName : null}
                        label='POC Name'
                        onChange={(e) => {
                          onChange(e)
                          setSelectedPocName(e.target.value)
                        }}
                        error={Boolean(errors.poc_name)}
                        placeholder='Ayush'
                        aria-describedby='validation-poc_name'
                      />
                    )}
                  />
                  {errors.poc_name && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-poc_name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='poc_mobile'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={selectedPocPhone ? selectedPocPhone : null}
                        label='POC Mobile Number'
                        onChange={(e) => {
                          onChange(e)
                          setSelectedPocPhone(e.target.value)
                        }}
                        error={Boolean(errors.poc_mobile)}
                        placeholder='xxxxxxxxxx'
                        aria-describedby='validation-poc_mobile'
                      />
                    )}
                  />
                  {errors.poc_mobile && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-poc_mobile'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. GST Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_gst'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={selectedGST ? selectedGST : null}
                        label='Company GST Number'
                        onChange={(e) => {
                          onChange(e)
                          setSelectedGST(e.target.value)
                        }}
                        error={Boolean(errors.company_gst)}
                        placeholder='XXXXXXXXXXXXXXXXXXXXXXX'
                        aria-describedby='validation-company_gst'
                      />
                    )}
                  />
                  {errors.company_gst && (
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
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={selectedUIN ? selectedUIN : null}
                        label='Company GST UIN'
                        onChange={(e => {
                          onChange(e)
                          setSelectedUIN(e.target.value)
                        })}
                        error={Boolean(errors.company_uin)}
                        placeholder='xxxxxxxxxx'
                        aria-describedby='validation-company_uin'
                      />
                    )}
                  />
                  {errors.company_uin && (
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
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={selectedCIN ? selectedCIN : null}
                        label='Company CIN Number'
                        onChange={(e) => {
                          onChange(e)
                          setSelectedCIN(e.target.value)
                        }}
                        error={Boolean(errors.company_cin)}
                        placeholder='XXXXXXXXXXXXXXXXXXXXXXX'
                        aria-describedby='validation-company_cin'
                      />
                    )}
                  />
                  {errors.company_cin && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_cin'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='company_logo'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={selectedLogo ? selectedLogo : null}
                        label='Company Logo file Name'
                        onChange={(e) => {
                          onChange(e)
                          setSelectedLogo(e.target.value)
                        }}
                        error={Boolean(errors.company_logo)}
                        placeholder='abc.jpeg'
                        aria-describedby='validation-company_logo'
                      />
                    )}
                  />
                  {errors.company_logo && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-company_logo'>
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
        )}
      </CardContent>
    </Card>
  )
}

export default CompanyDetails
