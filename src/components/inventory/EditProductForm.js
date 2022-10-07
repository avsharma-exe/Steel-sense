import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { Fragment } from 'react'
import Box from 'mdi-material-ui/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Typography from '@mui/material/Typography'

import useUserDetails from 'src/hooks/useUserDetails'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import StepLabel from '@mui/material/StepLabel'

import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import CircularProgress from '@mui/material/CircularProgress'

const productDetailsSchema = yup.object().shape({
  PName: yup.string().required(),
  Unit: yup.string().required(),
  PricePerUnit: yup.string().required()
})

const stockDetailsSchema = yup.object().shape({
  CurrentStock: yup.string().required(),
  LowStockLimit: yup.string().required(),
  MaxStockLimit: yup.string().required()
})

const EditProductForm = ({ product, onCloseHandle, getProducts }) => {
  const userDetails = useUserDetails();
  const [productDetails, setProductDetails] = useState(
    product
      ? {
          P_ID: product.P_ID,
          PName: product.PName,
          Unit: product.Unit,
          PricePerUnit: product.PurchasePrice
        }
      : null
  )
  const [value, setValue] = useState('product-info')
  const [loader, setLoader] = useState(false)
  const [stockDetails, setStockDetails] = useState(product ? [product] : [])
  const [stockDivisionTabs, setStockDivisionTabs] = useState(0)

  const {
    control: productDetailControl,
    handleSubmit: handleProductDetailsSubmit,
    formState: { errors: productDetailsError }
  } = useForm({
    defaultValues: {
      PName: product.PName,
      Unit: product.Unit,
      PricePerUnit: product.PurchasePrice
    },
    resolver: yupResolver(productDetailsSchema)
  })

  const {
    reset: stockDetailsReset,
    control: stockDetailsControl,
    handleSubmit: handleStockDetailsSubmit,
    formState: { errors: stockDetailsError }
  } = useForm({
    defaultValues: {
      CurrentStock: product.CurrentStock,
      LowStockLimit: product.LowStockLimit,
      MaxStockLimit: product.MaxStockLimit
    },
    resolver: yupResolver(stockDetailsSchema)
  })

  const handleTabsChange = (event, newValue) => {
    setValue(newValue)
  }

  const saveProductDetails = async e => {
    e.preventDefault()
    setLoader(true)
    await secureApi.patch(api_configs.product.updateProductMaster, productDetails).then(resp => {
      if (resp.status === 200) {
        toast.success('Product Details Updated')
        getProducts()
      }
    })
    setLoader(false)
  }

  const saveStockDetails = async e => {
    e.preventDefault()
    setLoader(true)

    await secureApi
      .patch(api_configs.product.updateStockDetails, {
        stockDetails,
        userDetails
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Stock Details Updated')
          getProducts()
        }
      })
    setLoader(false)
  }

  return (
    <Dialog
      open={true}
      onClose={() => onCloseHandle(false)}
      aria-labelledby='form-dialog-title'
      fullWidth={true}
      maxWidth={'xl'}
    >
      <DialogTitle id='form-dialog-title'>Edit Product</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons={false}
            onChange={handleTabsChange}
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab value='product-info' label='Product Details' />
            <Tab value='stock-details' label='Stock Details' />
          </TabList>
          <TabPanel value='product-info'>
            <form onSubmit={e => saveProductDetails(e)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PName'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.PName}
                          label='Product Name'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, PName: e.target.value })
                          }}
                          error={Boolean(productDetailsError.PName)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.PName && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='Unit'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.Unit}
                          label='Unit'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, Unit: e.target.value })
                          }}
                          error={Boolean(productDetailsError.Unit)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.Unit && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PricePerUnit'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.PricePerUnit}
                          label='Purchase Price Per Unit'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, PricePerUnit: e.target.value })
                          }}
                          placeholder='group'
                          error={Boolean(productDetailsError.PricePerUnit)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.PricePerUnit && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', float: 'right' }}>
                  <Button size='large' variant='outlined' color='secondary' disabled>
                    Back
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    {loader ? (
                      <CircularProgress
                        sx={{
                          color: 'common.white',
                          width: '20px !important',
                          height: '20px !important',
                          mr: theme => theme.spacing(2)
                        }}
                      />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value='stock-details'>
            <TabContext value={stockDivisionTabs}>
              <Grid container spacing={5}>
                <Grid item sm={3} xs={12}>
                  <TabList
                    orientation='vertical'
                    onChange={(e, newIndex) => {
                      stockDetailsReset({
                        CurrentStock: product.stockDetails[newIndex].CurrentStock,
                        LowStockLimit: product.stockDetails[newIndex].LowStockLimit,
                        MaxStockLimit: product.stockDetails[newIndex].MaxStockLimit
                      })
                      setStockDivisionTabs(newIndex)
                    }}
                    aria-label='vertical division tabs'
                  >
                    {stockDetails.map((stock, index) => {
                      return <Tab value={index} label={stock.DivisionName} />
                    })}
                  </TabList>
                </Grid>
                <Grid item sm={9} xs={12}>
                  {stockDetails.map((s, index) => {
                    return (
                      <TabPanel value={index}>
                        <form onSubmit={e => saveStockDetails(e)}>
                          <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <Controller
                                  name='CurrentStock'
                                  control={stockDetailsControl}
                                  rules={{ required: true }}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      value={value}
                                      disabled
                                      label='Current Stock'
                                      onChange={e => {
                                        onChange(e)
                                        const newStock = stockDetails.map(stock => {
                                          if (stock.P_Stock_ID === s.P_Stock_ID) {
                                            return { ...stock, CurrentStock: e.target.value }
                                          }

                                          return stock
                                        })
                                        setStockDetails(newStock)
                                      }}
                                      error={Boolean(stockDetailsError.CurrentStock)}
                                      aria-describedby='stepper-linear-account-username'
                                    />
                                  )}
                                />
                                {stockDetailsError.CurrentStock && (
                                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                                    {stockDetailsError.CurrentStock.message}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <Controller
                                  name='LowStockLimit'
                                  control={stockDetailsControl}
                                  rules={{ required: true }}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      value={value}
                                      label='Low Stock Limit'
                                      onChange={e => {
                                        onChange(e)
                                        const newStock = stockDetails.map(stock => {
                                          if (stock.P_Stock_ID === s.P_Stock_ID) {
                                            return { ...stock, LowStockLimit: e.target.value }
                                          }

                                          return stock
                                        })
                                        setStockDetails(newStock)
                                      }}
                                      error={Boolean(stockDetailsError.LowStockLimit)}
                                      aria-describedby='stepper-linear-account-username'
                                    />
                                  )}
                                />
                                {stockDetailsError.LowStockLimit && (
                                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                                    {stockDetailsError.LowStockLimit.message}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <Controller
                                  name='MaxStockLimit'
                                  control={stockDetailsControl}
                                  rules={{ required: true }}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      value={value}
                                      label='Max Stock Limit'
                                      onChange={e => {
                                        onChange(e)
                                        const newStock = stockDetails.map(stock => {
                                          if (stock.P_Stock_ID === s.P_Stock_ID) {
                                            return { ...stock, MaxStockLimit: e.target.value }
                                          }

                                          return stock
                                        })
                                        setStockDetails(newStock)
                                      }}
                                      error={Boolean(stockDetailsError.MaxStockLimit)}
                                      aria-describedby='stepper-linear-account-username'
                                    />
                                  )}
                                />
                                {stockDetailsError.MaxStockLimit && (
                                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                                    {stockDetailsError.MaxStockLimit.message}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Button size='large' variant='outlined' color='secondary' disabled>
                                Back
                              </Button>
                              <Button size='large' type='submit' variant='contained'>
                                {loader ? (
                                  <CircularProgress
                                    sx={{
                                      color: 'common.white',
                                      width: '20px !important',
                                      height: '20px !important',
                                      mr: theme => theme.spacing(2)
                                    }}
                                  />
                                ) : (
                                  'Save'
                                )}
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </TabPanel>
                    )
                  })}
                </Grid>
              </Grid>
            </TabContext>
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductForm
