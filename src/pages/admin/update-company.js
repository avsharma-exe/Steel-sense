// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Autocomplete from '@mui/material/Autocomplete';
import useUserDetails from "../../hooks/useUserDetails"
// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { secureApi } from '../../helpers/apiGenerator'
import api_paths from '../../configs/api_configs'


const steps = [
  {
    title: 'Update Company',
    subtitle: 'Update the Company Details'
  }
]

const defaultCompanyValues = {
  companyName: '',
  status: ''
}

const companySchema = yup.object().shape({
  companyName: yup.string().required(),
  status: yup.string().required()
})

// Main Component
const UpdateCompany = () => {

  const userDetails = useUserDetails()

  // ** Hooks
  const {
    handleSubmit: handleCompanySubmit,
    control: companyControl,
    formState: { errors: companyErrors }
  } = useForm({
    defaultValues: defaultCompanyValues,
    resolver: yupResolver(companySchema)
  })

  const updateCompany = async data => {
    await secureApi
      .post(api_paths.company.updateCompany, {
        CompanyName: data.company.companyName,
        status: data.company.status,
        user: userDetails.User_ID,
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Form Submitted')
        }
      })
  }

  const onSubmit = async data => {
    if (updateCompany(data)) {
      toast.success('Form Submitted')
    }
  }

  const [allCompanies , setAllCompanies] = useState([])
  const getAllCompanies = () => {
    secureApi.get(api_paths.company.getAll).then(res => {
      if(res.data.allCompanies.length > 0){
        let allCompanies = []
        res.data.allCompanies.map(company => {
          allCompanies.push({
            name: company.CompanyName + company.CompanyID,
            status: company.status,
          })
        })
        setAllCompanies(allCompanies)
      }
    })
  }

  useEffect(() => {
    getAllCompanies()
  }, [])

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleCompanySubmit(onSubmit)}>
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
              <Autocomplete
                disablePortal
                id="company-selector"
                options={allCompanies}
                getOptionLabel={option => option.name}
                renderInput={(params) => <TextField {...params} label="companies" />}
              />
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
              <Button size='large' type='submit' variant='contained'>
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UpdateCompany
