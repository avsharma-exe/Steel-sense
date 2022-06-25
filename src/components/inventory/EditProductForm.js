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

const defaultProductDetails = {
  PName: '',
  PGroup: '',
  PBrand: '',
  PItemCode: '',
  PPrintName: ''
}

const productDetailsSchema = yup.object().shape({
  PName: yup.string().required(),
  PGroup: yup.string().required(),
  PBrand: yup.string().required()
})

const defaultPriceDetails = {
  PurchasePrice: '',
  SalePrice: '',
  MinSalePrice: ''
}

const defaultPriceSchema = yup.object().shape({
  PurchasePrice: yup.number().required(),
  SalePrice: yup.number().required(),
  MinSalePrice: yup.number()
})

const defaultStockDetails = {
  unit: '',
  CurrentStock: ''
}

const stockDetailsSchema = yup.object().shape({
  CurrentStock: yup.string().required()
})

const defaultGstDetails = {
  HSN_SAC_Code: '',
  CGST: '',
  SGST: '',
  Cess: '',
  IGST: ''
}

const gstSchema = yup.object().shape({
  CGST: yup.string().required(),
  SGST: yup.string().required(),
  Cess: yup.string().required(),
  IGST: yup.string().required()
})

const defaultOtherDetails = {
  saleDiscount: '',
  lowLevelLimit: '',
  productType: '',
  serialno: ''
}

const otherDetailsSchema = yup.object().shape({})

const EditProductForm = ({ product, onCloseHandle }) => {
  const [productDetails, setProductDetails] = useState(product.productDetails ? product.productDetails[0] : null)
  const [value, setValue] = useState('product-info')

  const [priceDetails, setPriceDetails] = useState(product.priceDetails ? product.priceDetails[0] : null)
  const [stockDetails, setStockDetails] = useState(product.stockDetails ? product.stockDetails[0] : null)
  const [gstDetails, setGstDetails] = useState(product.gstDetails ? product.gstDetails : null)
  const [otherDetails, setOtherDetails] = useState(defaultOtherDetails)

  const {
    control: productDetailControl,
    handleSubmit: handleProductDetailsSubmit,
    formState: { errors: productDetailsError }
  } = useForm({
    defaultValues: {
      PName: product.productDetails[0].PName,
      PGroup: product.productDetails[0].PBrand,
      PBrand: product.productDetails[0].PGroup,
      PItemCode: '',
      PPrintName: ''
    },
    resolver: yupResolver(productDetailsSchema)
  })

  const {
    reset: priceDetailsReset,
    control: priceDetailsControl,
    handleSubmit: handlePriceDetailsSubmit,
    formState: { errors: priceDetailsError }
  } = useForm({
    defaultValues: {
      PurchasePrice: product.priceDetails[0].PurchasePrice,
      SalePrice: product.priceDetails[0].SalePrice,
      MinSalePrice: product.priceDetails[0].MinSalePrice
    },
    resolver: yupResolver(defaultPriceSchema)
  })

  const {
    reset: stockDetailsReset,
    control: stockDetailsControl,
    handleSubmit: handleStockDetailsSubmit,
    formState: { errors: stockDetailsError }
  } = useForm({
    defaultValues: {
      unit: '', // get unit name
      CurrentStock: product.stockDetails[0].CurrentStock
    },
    resolver: yupResolver(stockDetailsSchema)
  })

  const {
    reset: gstDetailsReset,
    control: gstDetailsControl,
    handleSubmit: handleGstDetailsSubmit,
    formState: { errors: gstDetailsError }
  } = useForm({
    defaultValues: {
      HSN_SAC_Code: product.gstDetails[0].HSN_SAC_Code,
      CGST: product.gstDetails[0].CGST,
      SGST: product.gstDetails[0].SGST,
      Cess: product.gstDetails[0].Cess,
      IGST: product.gstDetails[0].IGST
    },
    resolver: yupResolver(gstSchema)
  })

  const handleTabsChange = (event, newValue) => {
    setValue(newValue)
  }

  const saveProductDetails = e => {
    e.preventDefault()
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
            <Tab value='price-details' label='Price Details' />
            <Tab value='stock-details' label='Stock Details' />
            <Tab value='gst-details' label='Gst Details' />
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
                      name='PGroup'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.PGroup}
                          label='Product Group'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, PGroup: e.target.value })
                          }}
                          error={Boolean(productDetailsError.PGroup)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.PGroup && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PBrand'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.PBrand}
                          label='Product Brand'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, PBrand: e.target.value })
                          }}
                          placeholder='group'
                          error={Boolean(productDetailsError.PBrand)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.PBrand && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PItemCode'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.PItemCode}
                          label='Item Code'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, PItemCode: e.target.value })
                          }}
                          placeholder='group'
                          error={Boolean(productDetailsError.PItemCode)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.PItemCode && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PPrintName'
                      control={productDetailControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={productDetails.PPrintName}
                          label='Print Name'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...productDetails, PPrintName: e.target.value })
                          }}
                          placeholder='group'
                          error={Boolean(productDetailsError.PPrintName)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {productDetailsError.PPrintName && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
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
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value='stock-details'>
            <form onSubmit={e => saveProductDetails(e)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='unit'
                      control={stockDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Unit'
                          onChange={e => {
                            onChange(e)
                            setStockDetails({ ...stockDetails, unit: e.target.value })
                          }}
                          error={Boolean(stockDetailsError.unit)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {stockDetailsError.unit && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {stockDetailsError.unit.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='CurrentStock'
                      control={stockDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Current Stock'
                          onChange={onChange}
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
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' disabled>
                    Back
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value='price-details'>
            <form onSubmit={e => saveProductDetails(e)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='PurchasePrice'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Purchase Price'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...priceDetails, PurchasePrice: e.target.value })
                          }}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.PurchasePrice)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.PurchasePrice && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.PurchasePrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='SalePrice'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Sale Price'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...priceDetails, SalePrice: e.target.value })
                          }}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.SalePrice)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.SalePrice && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.SalePrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='MinSalePrice'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Min Sale Price'
                          onChange={e => {
                            onChange(e)
                            setProductDetails({ ...priceDetails, MinSalePrice: e.target.value })
                          }}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.MinSalePrice)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.MinSalePrice && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.MinSalePrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' disabled>
                    Back
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value='gst-details'>
            <form onSubmit={() => {}}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='HSN_SAC_Code'
                      control={gstDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={gstDetails.HSN_SAC_Code}
                          label='HSN / SAC Code'
                          onChange={e => {
                            onChange(e)
                            setGstDetails({ ...gstDetails, HSN_SAC_Code: e.target.value })
                          }}
                          error={Boolean(gstDetailsError.HSN_SAC_Code)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {gstDetailsError.HSN_SAC_Code && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {gstDetailsError.HSN_SAC_Code.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} spacing={8}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    GST Rules
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='CGST'
                      control={gstDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='CGST'
                          onChange={e => {
                            onChange(e)
                            setGstDetails({ ...gstDetails, CGST: e.target.value })
                          }}
                          error={Boolean(gstDetailsError.CGST)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {gstDetailsError.CGST && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {gstDetailsError.CGST.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='Cess'
                      control={gstDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='CESS'
                          onChange={e => {
                            onChange(e)
                            setGstDetails({ ...gstDetails, Cess: e.target.value })
                          }}
                          error={Boolean(gstDetailsError.Cess)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {gstDetailsError.Cess && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {gstDetailsError.Cess.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='SGST'
                      control={gstDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='SGST'
                          onChange={e => {
                            onChange(e)
                            setGstDetails({ ...gstDetails, SGST: e.target.value })
                          }}
                          error={Boolean(gstDetailsError.SGST)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {gstDetailsError.SGST && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {gstDetailsError.SGST.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='IGST'
                      control={gstDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='IGST'
                          onChange={e => {
                            onChange(e)
                            setGstDetails({ ...gstDetails, IGST: e.target.value })
                          }}
                          error={Boolean(gstDetailsError.IGST)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {gstDetailsError.IGST && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {gstDetailsError.IGST.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' disabled>
                    Back
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductForm
