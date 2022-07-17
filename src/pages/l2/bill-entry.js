// ** React Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import useUserDetails from '../../hooks/useUserDetails'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import Box from '@mui/material/Box'

import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from '../../configs/api_configs'

const StockInward = () => {

  return (
    <Card>
      <CardHeader title='Bill Entry' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ minHeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={e => handleSubmit(e)}>
          <Divider sx={{ m: 0 }} />
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Submit
            </Button>
            <Button size='large' color='secondary' variant='outlined'>
              Cancel
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}

export default StockInward


