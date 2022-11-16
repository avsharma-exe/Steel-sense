// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'

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
import Slider from '@mui/material/Slider'

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

const schema = yup.object().shape({})

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const UseProductForm = ({ handleClose, handleSubmit, show, productDetails }) => {
  const [stockUsed, setStockUsed] = useState(0)
  const marks = [
    {
      value: 1,
      label: '1 ' + productDetails.Unit
    },
    // {
    //   value: productDetails.LowStockLimit,
    //   label: <span style={{ color: 'red' }}>{productDetails.LowStockLimit + '' + productDetails.Unit}</span>
    // },
    {
      value: productDetails.CurrentStock,
      label: productDetails.CurrentStock + ' ' + productDetails.Unit
    }
  ]

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
        <Typography variant='h6'>Stock Usage Entry</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <Typography sx={{ mb: 6 }}>
          <b>Product - </b>
          <span style={{ fontSize: '20px' }}>{productDetails ? productDetails.PName : ''}</span>
        </Typography>
        {/* <Typography sx={{ mb: 6 }}>
          <b>Division - </b>
          <span style={{ fontSize: '20px' }}>
            {productDetails.division ? productDetails.division.DivisionName : ''}
          </span>
        </Typography> */}
        <Typography sx={{ mb: 6 }}>
          <b>Current Stock - </b>
          <span style={{ fontSize: '20px', color: 'green' }}>
            {productDetails ? productDetails.CurrentStock : ''} {productDetails.Unit}
          </span>
        </Typography>
        <Typography sx={{ mb: 6 }}>
          <b>Low Stock Limit- </b>
          <span style={{ fontSize: '20px', color: 'red' }}>
            {productDetails ? productDetails.LowStockLimit : ''} {productDetails.Unit}
          </span>
        </Typography>
        <Grid item xs={12} sm={6} sx={{ mb: 6, m: 4 }}>
          <Slider
            step={1}
            marks={marks}
            valueLabelDisplay='auto'
            getAriaValueText={value => setStockUsed(value)}
            min={1}
            max={productDetails.CurrentStock}
            aria-labelledby='custom-marks-slider'
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 6 }}>
          <TextField
            value={stockUsed}
            label='Quantity to Use'
            onChange={e => {
              setStockUsed(e.target.value)
            }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>{productDetails && productDetails.Unit}</InputAdornment>
            }}
          />
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={() => handleSubmit(stockUsed)}>
            Save
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default UseProductForm
