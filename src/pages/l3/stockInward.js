// ** React Imports
import { useEffect, useLayoutEffect, useState } from 'react'

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
import { InputAdornment } from '@mui/material'

import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from '../../configs/api_configs'



const StockInward = () => {

  const [allProducts, setAllProducts] = useState([])
  const [allSuppliers, setAllSuppliers] = useState([])
  const [Supplier, setSupplier] = useState(allSuppliers[0])
  const [InvoiceDate, setInvoiceDate] = useState(new Date())
  const [selectedProduct, setSelectedProduct] = useState(allProducts[0])
  const [TruckInfo, setTruckInfo] = useState('')
  const [quantity, setQuantity] = useState(null)
  const [productUnit, setProductUnit] = useState(null)

  const getSuppliers = async () => {
    await secureApi.get(api_configs.supplier.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.status === 200) {
        setAllSuppliers(res.data.allCompanies)
      }
    })
  }

  const getProductDetails = async (p_id) => {
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

  useLayoutEffect(() => {
    getSuppliers()
    getDivProducts()
  }, [])

  useEffect(() => {
    if(allProducts && allProducts.length)
      console.log('allProducts', allProducts);
  }, [allProducts])

  const userDetails = useUserDetails()

  const handleSubmit = async e => {

    // e.preventDefault()

    let body = {
      Co_ID: userDetails.Co_ID,
      Div_ID: userDetails.Div_ID,
      P_ID: selectedProduct.P_ID,
      Supplier_ID: Supplier.Co_ID,
      InvoiceDate: InvoiceDate,
      TruckInfo: TruckInfo,
      Quantity: quantity,
      user: userDetails.User_ID
    }

    console.log(body)

    await secureApi.post(api_configs.stockInOut.createStockInward, body).then(res => {
      // console.log()
      if (!res.data.error) {
        setAllProducts(res.data.allProducts)
      }
    })
  }

  return (
    <Card>
      <CardHeader title='Stock Inward Details' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ minHeight: 500, display: 'flex' }}>
        <form onSubmit={e => handleSubmit(e)}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={selectedProduct ? selectedProduct : null}
                  onChange={(event, value) => {
                    setSelectedProduct(value)
                    getProductDetails(value.P_ID)
                  }}
                  options={allProducts}
                  getOptionLabel={option => option.PName}
                  renderOption={(props, option) => <Box {...props}>{option.PName}</Box>}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name='product'
                      label='Choose a Product'
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={Supplier ? Supplier : null}
                  onChange={(event, value) => {
                    setSupplier(value)
                  }}
                  options={allSuppliers}
                  getOptionLabel={option => option.CompanyName}
                  renderOption={(props, option) => <Box {...props}>{option.CompanyName}</Box>}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name='Supplier'
                      label='Choose a Supplier'
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
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
                  placeholder='12'
                  onChange={e => setQuantity(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{productUnit && productUnit.UnitName}</InputAdornment>
                  }}
                />
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
      </CardContent>
    </Card>
  )

}

export default StockInward
