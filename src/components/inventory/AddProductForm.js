import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { Fragment } from 'react'
import Box from 'mdi-material-ui/Box'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepperCustomDot from '../utils/StepperCustomDot'
import StepperWrapper from 'src/@core/styles/mui/stepper'

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

const steps = [
  {
    title: 'Product Details',
    subtitle: 'Enter the Product Details'
  },
  {
    title: 'Price Details',
    subtitle: 'Enter Price Details'
  },
  {
    title: 'Stock and Unit Details',
    subtitle: 'Enter Stock and Unit Detials'
  },
  {
    title: 'GST Details',
    subtitle: 'Enter GST Details'
  },
  {
    title: 'Other Details',
    subtitle: 'Enter Any Other Details'
  }
]

const defaultProductDetails = {
  productName: '',
  productGroup: '',
  productBrand: '',
  itemCode: '',
  printName: ''
}

const productDetailsSchema = yup.object().shape({
  productGroup: yup.string().required(),
  productBrand: yup.string().required(),
  productName: yup.string().required()
})

const defaultPriceDetails = {
  purchasePrice: '',
  salePrice: '',
  minSalePrice: '',
  mrp: ''
}

const defaultPriceSchema = yup.object().shape({
  purchasePrice: yup.number().required(),
  salePrice: yup.number().required(),
  minSalePrice: yup.number(),
  mrp: yup.number()
})

const defaultStockDetails = {
  unit: '',
  openingStock: '',
  openingStockValue: ''
}

const stockDetailsSchema = yup.object().shape({
  unit: yup.string().required()
})

const defaultGstDetails = {
  hsnCode: '',
  cgst: '',
  sgst: '',
  cess: '',
  igst: ''
}

const gstSchema = yup.object().shape({
  cgst: yup.string().required(),
  sgst: yup.string().required(),
  cess: yup.string().required(),
  igst: yup.string().required()
})

const defaultOtherDetails = {
  saleDiscount: '',
  lowLevelLimit: '',
  productType: '',
  serialno: ''
}

const otherDetailsSchema = yup.object().shape({})

const AddProductForm = ({ onCloseHandle }) => {
  const userDetails = useUserDetails()
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [productDetails, setProductDetails] = useState(defaultProductDetails)
  const [priceDetails, setPriceDetails] = useState(defaultPriceDetails)
  const [stockDetails, setStockDetails] = useState(defaultStockDetails)
  const [gstDetails, setGstDetails] = useState(defaultGstDetails)
  const [otherDetails, setOtherDetails] = useState(defaultOtherDetails)

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // productDetails controller
  const {
    reset: productDetailsReset,
    control: productDetailControl,
    handleSubmit: handleProductDetailsSubmit,
    formState: { errors: productDetailsError }
  } = useForm({
    defaultValues: defaultProductDetails,
    resolver: yupResolver(productDetailsSchema)
  })

  // priceDetails controller
  const {
    reset: priceDetailsReset,
    control: priceDetailsControl,
    handleSubmit: handlePriceDetailsSubmit,
    formState: { errors: priceDetailsError }
  } = useForm({
    defaultValues: defaultPriceDetails,
    resolver: yupResolver(defaultPriceSchema)
  })

  // stockDetails controller
  const {
    reset: stockDetailsReset,
    control: stockDetailsControl,
    handleSubmit: handleStockDetailsSubmit,
    formState: { errors: stockDetailsError }
  } = useForm({
    defaultValues: defaultStockDetails,
    resolver: yupResolver(stockDetailsSchema)
  })

  // gstDetails controller
  const {
    reset: gstDetailsReset,
    control: gstDetailsControl,
    handleSubmit: handleGstDetailsSubmit,
    formState: { errors: gstDetailsError }
  } = useForm({
    defaultValues: defaultGstDetails,
    resolver: yupResolver(gstSchema)
  })

  // otherDetails controller
  const {
    reset: otherDetailsReset,
    control: otherDetailsControl,
    handleSubmit: handleOtherDetailsSubmit,
    formState: { errors: otherDetailsError }
  } = useForm({
    defaultValues: defaultOtherDetails,
    resolver: yupResolver(otherDetailsSchema)
  })

  const handleReset = () => {
    setActiveStep(0)
    productDetailsReset(defaultProductDetails)
    priceDetailsReset(defaultPriceDetails)
    stockDetailsReset(defaultStockDetails)
    gstDetailsReset(defaultGstDetails)
    otherDetailsReset(defaultOtherDetails)
  }

  const addProduct = async () => {
    setLoading(true)
    const product = {
      productDetails,
      priceDetails,
      stockDetails,
      gstDetails,
      otherDetails,
      userDetails
    }

    await secureApi
      .post(api_configs.product.create, product)
      .then(() => {
        setLoading(false)
        toast.success('Product Added Successfully')
        handleReset()
      })
      .catch(err => {
        setLoading(false)
        toast.error('Something went Wrong!')
        handleReset()
      })
  }

  const onSubmit = async data => {
    setActiveStep(activeStep + 1)
    switch (activeStep) {
      case 0:
        setProductDetails(data)
        break
      case 1:
        setPriceDetails(data)
        break
      case 2:
        setStockDetails(data)
        break
      case 3:
        setGstDetails(data)
        break
      case 4:
        setOtherDetails(data)
        break
    }

    if (activeStep === steps.length - 1) addProduct()
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleProductDetailsSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} spacing={8}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='productName'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Name'
                        onChange={onChange}
                        placeholder='product'
                        error={Boolean(productDetailsError.productName)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.productName && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='productGroup'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Group'
                        onChange={onChange}
                        placeholder='group'
                        error={Boolean(productDetailsError.productGroup)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.productGroup && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='productBrand'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Brand'
                        onChange={onChange}
                        placeholder='group'
                        error={Boolean(productDetailsError.productBrand)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.productBrand && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='itemCode'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Item Code'
                        onChange={onChange}
                        placeholder='group'
                        error={Boolean(productDetailsError.itemCode)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.itemCode && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='printName'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Print Name'
                        onChange={onChange}
                        placeholder='group'
                        error={Boolean(productDetailsError.printName)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.printName && (
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
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <>
            <form key={1} onSubmit={handlePriceDetailsSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} spacing={8}>
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
                      name='purchasePrice'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Purchase Price'
                          onChange={onChange}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.purchasePrice)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.purchasePrice && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.purchasePrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='salePrice'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Sale Price'
                          onChange={onChange}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.salePrice)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.salePrice && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.salePrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='minSalePrice'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Min Sale Price'
                          onChange={onChange}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.minSalePrice)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.minSalePrice && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.minSalePrice.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='mrp'
                      control={priceDetailsControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='MRP'
                          onChange={onChange}
                          startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                          error={Boolean(priceDetailsError.mrp)}
                          aria-describedby='stepper-linear-account-username'
                        />
                      )}
                    />
                    {priceDetailsError.mrp && (
                      <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                        {priceDetailsError.mrp.message}
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
          </>
        )
      case 2:
        return (
          <form key={2} onSubmit={handleStockDetailsSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} spacing={8}>
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
                    name='unit'
                    control={stockDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Unit'
                        onChange={onChange}
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
                    name='openingStock'
                    control={stockDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Opening Stock'
                        onChange={onChange}
                        error={Boolean(stockDetailsError.openingStock)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {stockDetailsError.openingStock && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {stockDetailsError.openingStock.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='openingStockValue'
                    control={stockDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Opening Stock Value'
                        onChange={onChange}
                        error={Boolean(stockDetailsError.openingStockValue)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {stockDetailsError.openingStockValue && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {stockDetailsError.openingStockValue.message}
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
      case 3:
        return (
          <form key={3} onSubmit={handleGstDetailsSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} spacing={8}>
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
                    name='hsnCode'
                    control={gstDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='HSN / SAC Code'
                        onChange={onChange}
                        error={Boolean(gstDetailsError.hsnCode)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {gstDetailsError.hsnCode && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {gstDetailsError.hsnCode.message}
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
                    name='cgst'
                    control={gstDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='CGST'
                        onChange={onChange}
                        error={Boolean(gstDetailsError.cgst)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {gstDetailsError.cgst && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {gstDetailsError.cgst.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='cess'
                    control={gstDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='CESS'
                        onChange={onChange}
                        error={Boolean(gstDetailsError.cess)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {gstDetailsError.cess && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {gstDetailsError.cess.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='sgst'
                    control={gstDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='SGST'
                        onChange={onChange}
                        error={Boolean(gstDetailsError.sgst)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {gstDetailsError.sgst && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {gstDetailsError.cess.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='igst'
                    control={gstDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='IGST'
                        onChange={onChange}
                        error={Boolean(gstDetailsError.igst)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {gstDetailsError.igst && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {gstDetailsError.igst.message}
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
      case 4:
        return (
          <form key={1} onSubmit={handleOtherDetailsSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} spacing={8}>
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
                    name='saleDiscount'
                    control={otherDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Sale Discount'
                        onChange={onChange}
                        startAdornment={<InputAdornment position='start'>%</InputAdornment>}
                        error={Boolean(otherDetailsError.saleDiscount)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {otherDetailsError.saleDiscount && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {otherDetailsError.saleDiscount.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='lowLevelLimit'
                    control={otherDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Low Level Limit'
                        onChange={onChange}
                        error={Boolean(otherDetailsError.lowLevelLimit)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {otherDetailsError.lowLevelLimit && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {otherDetailsError.lowLevelLimit.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='productType'
                    control={otherDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Type'
                        onChange={onChange}
                        error={Boolean(otherDetailsError.productType)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {otherDetailsError.productType && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {otherDetailsError.productType.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='serialno'
                    control={otherDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Serial No'
                        onChange={onChange}
                        error={Boolean(otherDetailsError.serialno)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {otherDetailsError.serialno && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {otherDetailsError.serialno.message}
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
        return
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Add Another Product
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={() => onCloseHandle()}
        aria-labelledby='form-dialog-title'
        fullWidth={true}
        maxWidth={'xl'}
      >
        <DialogTitle id='form-dialog-title'>Add Product</DialogTitle>

        <DialogContent>
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
            <StepperWrapper>
              <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                  const labelProps = {}
                  if (index == activeStep) {
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
          )}

          <Divider sx={{ m: 0 }} />
        </DialogContent>
        <DialogContent>{renderContent()}</DialogContent>
      </Dialog>
    </>
  )
}

export default AddProductForm
