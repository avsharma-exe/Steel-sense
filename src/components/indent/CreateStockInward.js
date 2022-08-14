import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'

import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import useUserDetails from '../../hooks/useUserDetails'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import Box from '@mui/material/Box'
import { InputAdornment } from '@mui/material'

import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from '../../configs/api_configs'

const CreateStockInward = ({ indent, onClose, updateIncommingOreders }) => {

  console.log(indent)

  const [allProducts, setAllProducts] = useState([])
  const [allSuppliers, setAllSuppliers] = useState([])
  const [InvoiceDate, setInvoiceDate] = useState(new Date())
  const [TruckInfo, setTruckInfo] = useState('')
  const [quantity, setQuantity] = useState(null)
  const [status, setStatus] = useState(null)
  const [productUnit, setProductUnit] = useState(null)

  const getSuppliers = async () => {
    await secureApi.get(api_configs.supplier.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.status === 200) {
        setAllSuppliers(res.data.allCompanies)
      }
    })
  }

  const getProductDetails = async p_id => {
    await secureApi.get(api_configs.product.getProductByID, { params: { product: p_id } }).then(res => {
      if (res.data.product.length > 0) {
        // console.log(res.data);
        setProductUnit(res.data.product[0])
      }
    })
  }

  const getDivProducts = async () => {
    await secureApi
      .get(api_configs.product.getDivProducts, { params: { coid: userDetails.Co_ID, div_id: userDetails.Div_ID } })
      .then(res => {
        if (!res.data.error) {
          console.log('div products', res.data.allProducts, allProducts)
          setAllProducts(res.data.allProducts)
        }
      })
  }

  useEffect(() => {
    getSuppliers()
    getDivProducts()
  }, [])

  useEffect(() => {
    if (allProducts && allProducts.length) console.log('allProducts', allProducts)
  }, [allProducts])

  const userDetails = useUserDetails()

  const handleSubmit = async ()=> {
    // e.preventDefault()

    let body = {
      Co_ID: userDetails.Co_ID,
      Div_ID: indent.Div_ID,
      P_ID: indent.P_ID,
      Supplier_ID: indent.Co_ID,
      InvoiceDate: InvoiceDate.getDate() + "-" + (InvoiceDate.getMonth() + 1) + "-" + InvoiceDate.getFullYear(),
      TruckInfo: TruckInfo,
      Quantity: status === '99' ? parseInt(indent.Quantity) - parseInt(quantity) : quantity,
      user: userDetails.User_ID,
      status: status,
      P_Stock_In_ID: indent.P_Stock_In_ID,
      P_Stock_In_Voucher_ID: indent.P_Stock_In_Voucher_ID
    }

    console.log(body)

    await secureApi.post(api_configs.stockInOut.createStockInward, body).then(res => {
      // console.log()
      if (!res.data.error) {
        setAllProducts(res.data.allProducts)
        updateIncommingOreders()
      }
    })
  }

  return (
    <Dialog open={true} onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>Create Stock Inward</DialogTitle>
      <DialogContent>
        <form onSubmit={e => handleSubmit(e)}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={12}>
                <Typography>
                  <b>Product -</b> {indent.PName ? indent.PName : ''}
                </Typography>
                <Typography>
                  <b>Supplier -</b> {indent.CompanyName ? indent.CompanyName : ''}
                </Typography>
                <Typography>
                  <b>Requested Quantity -</b> {indent.Quantity ? indent.Quantity + " " + indent.Unit : ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
                    <DatePicker
                      fullWidth
                      label='Invoice Date'
                      value={InvoiceDate}
                      onChange={newValue => setInvoiceDate(newValue)}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Truck Info'
                  placeholder='MH-XX-CC-7777'
                  onChange={e => setTruckInfo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Quantity'
                  type="number"

                  placeholder='12'
                  onChange={e => {
                    setQuantity(e.target.value)
                    if(e.target.value >= parseInt(indent.Quantity)) {
                      setStatus(50)
                    } else {
                      setStatus(99)
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{productUnit && productUnit.UnitName}</InputAdornment>,
                    inputProps: { min: 0, max: indent.Quantity }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  value={status}
                  label='Status'
                  onChange={e => setStatus(e.target.value)}
                  style={{width: "100%", color: "black"}}
                  placeholder='Status'
                  labelId='stepper-linear-personal-country'
                  aria-describedby='stepper-linear-personal-country-helper'
                  select
                >
                  <MenuItem key={1} value='50'>- Fully Filled -</MenuItem>
                  <MenuItem key={1} value='99'>- Partially Filled-</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: 0 }} />
          <CardActions>
            <Button size='large' type='button' onClick={() => handleSubmit()} sx={{ mr: 2 }} variant='contained'>
              Save
            </Button>
          </CardActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateStockInward
