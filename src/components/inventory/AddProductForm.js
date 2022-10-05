import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { Fragment, useEffect } from 'react'
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
import StepContent from '@mui/material/StepContent'
import clsx from 'clsx'

const steps = [
  {
    title: 'Product Details',
    subtitle: 'Enter the Product Details'
  },
  {
    title: 'Stock and Unit Details',
    subtitle: 'Enter Stock and Unit Detials'
  },
]

const defaultProductDetails = {
  productName: '',
  unit: '',
  purchasePrice: '',
}

const productDetailsSchema = yup.object().shape({
  unit: yup.string().required(),
  purchasePrice: yup.string().required(),
  productName: yup.string().required()
})

const defaultStockDetails = {

  openingStock: '',
  LowStockLimit: '',
  MaxStockLimit: ''
}

const stockDetailsSchema = yup.object().shape({
  // openingStock: yup.string().required(),
  // LowStockLimit: yup.string().required(),
  // MaxStockLimit: yup.string().required()
})


const AddProductForm = ({ onCloseHandle, getProducts, allDivs }) => {

  // console.log(allDivs)

  const userDetails = useUserDetails()
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [activeVerticalStep, setActiveVerticalStep] = useState(0)
  const [productDetails, setProductDetails] = useState(defaultProductDetails)
  const [stockDetails, setStockDetails] = useState(defaultStockDetails)
  const [divisions, setDivisions] = useState(allDivs)
  const [allStocks, setAllStocks] = useState({})
  const [submitForm, setSubmit] = useState(false)



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


  const handleReset = () => {
    setActiveStep(0)
    productDetailsReset(defaultProductDetails)
    stockDetailsReset(defaultStockDetails)
  }

  // const getUserDivisions = async () => {
  //   let userDivision = await secureApi(api_configs.division.getAll, {
  //     params: {
  //       coid: userDetails.Co_ID
  //     }
  //   })
  //   console.log(userDivision)
  //   if (userDivision.status === 200) {
  //     setDivisions(userDivision.data.allDivisions)
  //   }
  // }

  const addProduct = async () => {
    setLoading(true)

    const product = {
      productDetails,
      allStocks,
      userDetails: { User_ID: userDetails.User_ID, Co_ID: userDetails.Co_ID }
    }
    

    await secureApi
      .post(api_configs.product.create, product)
      .then(() => {
        setLoading(false)
        getProducts()
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
    if (activeStep === 1) {
      setSubmit(true)
    } else setActiveStep(activeStep + 1)
    switch (activeStep) {
      case 0:
        setProductDetails(data)
        break
      case 1:
        let divID = divisions[activeVerticalStep].Div_ID
        let allstocks = allStocks
        console.log(data)
        if(data.LowStockLimit != "" || data.MaxStockLimit != "" || data.openingStock != ""){
          allstocks[divID] = data
        }
        setAllStocks(allstocks)
        stockDetailsReset(defaultStockDetails)
        setActiveVerticalStep(activeVerticalStep + 1)

        if(submitForm)
          addProduct()

        // setStockDetails(data)
        break
    }
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
                    name='unit'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Unit'
                        onChange={onChange}
                        error={Boolean(productDetailsError.unit)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.unit && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {productDetailsError.unit.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='purchasePrice'
                    control={productDetailControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Purchase Price Per Unit'
                        onChange={onChange}
                        startAdornment={<InputAdornment position='start'>₹</InputAdornment>}
                        error={Boolean(productDetailsError.purchasePrice)}
                        aria-describedby='stepper-linear-account-username'
                      />
                    )}
                  />
                  {productDetailsError.purchasePrice && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
                      {productDetailsError.purchasePrice.message}
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
            <StepperWrapper>
              <Stepper activeStep={activeVerticalStep} orientation='vertical'>
                {divisions.map((div, index) => {
                  return (
                    <Step key={index} className={clsx({ active: activeVerticalStep === index })}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <div>
                            <Typography className='step-title'>{div.DivisionName} Division</Typography>
                            <Typography className='step-subtitle'>
                              Enter Stock Details for {div.DivisionName} Division
                            </Typography>
                          </div>
                        </div>
                      </StepLabel>
                      <StepContent>
                        <form key={index + 10} onSubmit={handleStockDetailsSubmit(onSubmit)}>
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
                                  name='openingStock'
                                  control={stockDetailsControl}
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
                                  name='LowStockLimit'
                                  control={stockDetailsControl}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      value={value}
                                      label='Low Stock Limit'
                                      onChange={e => {
                                        onChange(e)
                                        setStockDetails({ ...stockDetails, LowStockLimit: e.target.value })
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
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      value={value}
                                      label='Max Stock Limit'
                                      onChange={e => {
                                        onChange(e)
                                        setStockDetails({ ...stockDetails, MaxStockLimit: e.target.value })
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
                              <Button
                                size='large'
                                variant='outlined'
                                color='secondary'
                                onClick={() => {
                                  activeVerticalStep === 0
                                    ? handleBack()
                                    : setActiveVerticalStep(prevActiveStep => prevActiveStep - 1)
                                }}
                              >
                                Back
                              </Button>
                              <Button size='large' type='next' variant='contained' >
                                Next
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </StepContent>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
            {activeVerticalStep === divisions.length ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  variant='outlined'
                  color='secondary'
                  onClick={() => {
                    activeVerticalStep === 0
                      ? handleBack()
                      : setActiveVerticalStep(prevActiveStep => prevActiveStep - 1)
                  }}
                >
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Submit
                </Button>
              </Grid>
            ) : null}
          </>
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

  // useEffect(() => {
  //   getUserDivisions()
  // }, [])

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
