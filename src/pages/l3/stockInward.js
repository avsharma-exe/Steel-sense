// // ** React Imports
// import { useEffect, useState } from 'react'

// import Card from '@mui/material/Card'
// import Grid from '@mui/material/Grid'
// import Button from '@mui/material/Button'
// import Divider from '@mui/material/Divider'
// import MenuItem from '@mui/material/MenuItem'
// import TextField from '@mui/material/TextField'
// import CardHeader from '@mui/material/CardHeader'
// import InputLabel from '@mui/material/InputLabel'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'
// import CardActions from '@mui/material/CardActions'
// import FormControl from '@mui/material/FormControl'
// import Select from '@mui/material/Select'
// import { styled } from '@mui/material/styles'
// import Autocomplete from '@mui/material/Autocomplete'
// import useUserDetails from '../../hooks/useUserDetails'
// import DatePicker from '@mui/lab/DatePicker'
// import LocalizationProvider from '@mui/lab/LocalizationProvider'
// import AdapterDateFns from '@mui/lab/AdapterDateFns'
// import Box from '@mui/material/Box'

// import { secureApi } from 'src/helpers/apiGenerator'
// import api_configs from '../../configs/api_configs'

// // Styled component for the form
// const Form = styled('form')(({ theme }) => ({
//   maxWidth: 400,
//   padding: theme.spacing(12),
//   borderRadius: theme.shape.borderRadius,
//   border: `1px solid ${theme.palette.divider}`
// }))

// const StockInward = () => {
//   // ** States
//   const [allDivisions, setAllDivision] = useState([])

//   const [language, setLanguage] = useState([])

//   // ** Form Variables
//   const [selectedDiv, setSelectedDiv] = useState(allDivisions.length > 0 && allDivisions[0])
//   const [selectedSupplier, setSelectedSupplier] = useState(allSuppliers.length > 0 && allSuppliers[0])

//   const [InvoiceTo, setInvoiceTo] = useState('')
//   const [Consignee, setConsignee] = useState('')
//   const [TermsOfPayment, setTermsOfPayment] = useState('')
//   const [DispatchedThrough, setDispatchedThrough] = useState('')
//   const [Destination, setDestination] = useState('')
//   const [TermsOfDelivery, setTermsOfDelivery] = useState('')
//   const [InvoiceSubTotal, setInvoiceSubTotal] = useState('')
//   const [InvoiceTax, setInvoiceTax] = useState('')
//   const [InvoiceTotal, setInvoiceTotal] = useState('')

//   const [Quantity, setQuantity] = useState('')
//   const [Rate, setRate] = useState('')
//   const [DiscountPercent, setDiscountPercent] = useState('')
//   const [TaxRate, setTaxRate] = useState('')
//   const [Amount, setAmount] = useState('')
//   const [Remarks, setRemarks] = useState('')
//   const [dueOn, setDueOn] = useState(new Date())
//   const [isItemReceived, setItemReceived] = useState('0')
//   const [isInwardChecked, setInwardChecked] = useState('0')
//   const [isPaymentCompleted, setPaymentCompleted] = useState('0')

//   const getDivisions = async () => {
//     await secureApi.get(api_configs.division.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
//       if (res.status === 200) {
//         setAllDivision(res.data.allDivisions)
//         console.log(res.data.allDivisions)
//       }
//     })
//   }

//   const getSuppliers = async () => {
//     await secureApi.get(api_configs.supplier.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
//       if (res.status === 200) {
//         setAllSuppliers(res.data.allCompanies)
//       }
//     })
//   }

//   const getDivProducts = async div_id => {
//     console.log(div_id)
//     await secureApi
//       .get(api_configs.product.getDivProducts, { params: { coid: userDetails.Co_ID, div_id: div_id } })
//       .then(res => {
//         // console.log()
//         if (!res.data.error) {
//           setAllProducts(res.data.allProducts)
//         }
//       })
//   }

//   useEffect(() => {
//     getDivisions()
//     getSuppliers()
//   }, [])

//   const userDetails = useUserDetails()

//   const handleSubmit = async e => {
//     console.log(selectedProduct)
//     e.preventDefault()

//     let body = {
//       voucher: {
//         Co_ID: userDetails.Co_ID,
//         Div_ID: selectedDiv.Div_ID,
//         InvoiceTo: InvoiceTo,
//         Consignee: Consignee,
//         Supplier: Supplier,
//         VoucherNo: userDetails.Co_ID + userDetails.Div_ID,
//         ReferenceNo: '0',
//         InvoiceDate: InvoiceDate,
//         TermsOfPayment: TermsOfPayment,
//         OtherReferences: 'Kuch Nahi',
//         DispatchedThrough: DispatchedThrough,
//         Destination: Destination,
//         TermsOfDelivery: TermsOfDelivery,
//         TruckInfo: TruckInfo,
//         Remarks: Remarks,
//         InvoiceSubTotal: InvoiceSubTotal,
//         InvoiceTax: InvoiceTax,
//         InvoiceTotal: InvoiceTotal
//       },
//       inward: {
//         P_ID: selectedProduct.P_ID,
//         Quantity: Quantity,
//         Rate: Rate,
//         DiscountPercent: DiscountPercent,
//         TaxRate: TaxRate,
//         Amount: Amount,
//         DueOn: dueOn,
//         IsItemReceived: isItemReceived,
//         IsInwardChecked: isInwardChecked,
//         IsPaymentCompleted: isPaymentCompleted,
//         Remarks: Remarks
//       },
//       user: userDetails.User_ID
//     }

//     await secureApi.post(api_configs.stockInOut.createStockInward, body).then(res => {
//       // console.log()
//       if (!res.data.error) {
//         setAllProducts(res.data.allProducts)
//       }
//     })
//     console.log(
//       selectedDiv,
//       InvoiceTo,
//       Consignee,
//       Supplier,
//       InvoiceDate,
//       TermsOfPayment,
//       DispatchedThrough,
//       Destination,
//       TermsOfDelivery,
//       TruckInfo,
//       InvoiceSubTotal,
//       InvoiceTax,
//       InvoiceTotal
//     )
//     console.log(
//       selectedProduct,
//       Quantity,
//       Rate,
//       DiscountPercent,
//       TaxRate,
//       Amount,
//       isItemReceived,
//       isInwardChecked,
//       Remarks,
//       isPaymentCompleted
//     )
//   }

//   return (
//     <Card>
//       <CardHeader title='Stock Inward Details' titleTypographyProps={{ variant: 'h6' }} />
//       <CardContent sx={{ minHeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <form onSubmit={e => handleSubmit(e)}>
//           <CardContent>
//             <Grid container spacing={5}>
//               <Grid item xs={12}>
//                 <Typography variant='body2' sx={{ fontWeight: 600 }}>
//                   1. Inward Voucher
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Autocomplete
//                   value={selectedSupplier ? selectedSupplier : null}
//                   onChange={(event, value) => {
//                     setSelectedSupplier(value)
//                   }}
//                   options={allDivisions}
//                   getOptionLabel={option => option.DivisionName}
//                   renderOption={(props, option) => <Box {...props}>{option.DivisionName}</Box>}
//                   renderInput={params => (
//                     <TextField
//                       {...params}
//                       name='divsion'
//                       label='Choose a Division'
//                       inputProps={{
//                         ...params.inputProps
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Invoice To'
//                   placeholder='Nandan Steels'
//                   onChange={e => setInvoiceTo(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Consignee'
//                   placeholder='Steel'
//                   onChange={e => setConsignee(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Autocomplete
//                   value={selectedDiv ? selectedDiv : null}
//                   onChange={(event, value) => {
//                     getDivProducts(value.Div_ID)
//                     setSelectedDiv(value)
//                   }}
//                   options={allSuppliers}
//                   getOptionLabel={option => option.CompanyName}
//                   renderOption={(props, option) => <Box {...props}>{option.CompanyName}</Box>}
//                   renderInput={params => (
//                     <TextField
//                       {...params}
//                       name='divsion'
//                       label='Choose a Supplier'
//                       inputProps={{
//                         ...params.inputProps
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
//                     <DatePicker
//                       fullWidth
//                       label='Invoice Date'
//                       value={InvoiceDate}
//                       onChange={newValue => setInvoiceDate(newValue)}
//                       renderInput={params => <TextField {...params} />}
//                     />
//                   </LocalizationProvider>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Terms Of Payment'
//                   placeholder='Days in which Payment is expected'
//                   onChange={e => setTermsOfPayment(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Dispatched Through'
//                   placeholder='Ram Steels Bhandara'
//                   onChange={e => setDispatchedThrough(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Destination'
//                   placeholder='Nanadan Steels Raipur'
//                   onChange={e => setDestination(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Terms of Delivery'
//                   placeholder='Days in which delivery was expected'
//                   onChange={e => setTermsOfDelivery(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Truck Info'
//                   placeholder='MH-XX-CC-7777'
//                   onChange={e => setTruckInfo(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Invoice Sub Total'
//                   placeholder='500000'
//                   onChange={e => setInvoiceSubTotal(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Invoice Tax '
//                   placeholder='12'
//                   onChange={e => setInvoiceTax(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Invoice Total '
//                   placeholder='560000'
//                   onChange={e => setInvoiceTotal(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Divider sx={{ mb: 0 }} />
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant='body2' sx={{ fontWeight: 600 }}>
//                   2. Personal Info
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Autocomplete
//                   value={selectedProduct ? selectedProduct : null}
//                   onChange={(event, value) => {
//                     setSelectedProduct(value)
//                   }}
//                   options={allProducts}
//                   getOptionLabel={option => option.PName}
//                   renderOption={(props, option) => <Box {...props}>{option.PName}</Box>}
//                   renderInput={params => (
//                     <TextField
//                       {...params}
//                       name='product'
//                       label='Choose a Product'
//                       inputProps={{
//                         ...params.inputProps
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField fullWidth label='Quantity' placeholder='10' onChange={e => setQuantity(e.target.value)} />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField fullWidth label='Rate' placeholder='5000' onChange={e => setRate(e.target.value)} />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Discount Percent'
//                   placeholder='10'
//                   onChange={e => setDiscountPercent(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField fullWidth label='Tax Rate' placeholder='4' onChange={e => setTaxRate(e.target.value)} />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField fullWidth label='Amount' placeholder='10000' onChange={e => setAmount(e.target.value)} />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
//                     <DatePicker
//                       name='Due_On'
//                       fullWidth
//                       label='Due On'
//                       value={dueOn}
//                       onChange={newValue => setDueOn(newValue)}
//                       renderInput={params => <TextField {...params} />}
//                     />
//                   </LocalizationProvider>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Box sx={{ minWidth: 120 }}>
//                   <FormControl fullWidth>
//                     <InputLabel id='is-item-received'>Item Received</InputLabel>
//                     <Select
//                       labelId='is-item-received'
//                       name='IsItemReceived'
//                       value={isItemReceived}
//                       label='Is Item Received'
//                       onChange={e => {
//                         setItemReceived(e.target.value)
//                       }}
//                     >
//                       <MenuItem value='0'>No</MenuItem>
//                       <MenuItem value='50'>Yes</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Box sx={{ minWidth: 120 }}>
//                   <FormControl fullWidth>
//                     <InputLabel id='is-inward-checked'>Inward Checked</InputLabel>
//                     <Select
//                       labelId='is-inward-checked'
//                       name='IsInwardChecked'
//                       value={isInwardChecked}
//                       label='Is Inward Checked'
//                       onChange={e => {
//                         setInwardChecked(e.target.value)
//                       }}
//                     >
//                       <MenuItem value='0'>No</MenuItem>
//                       <MenuItem value='50'>Yes</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Box sx={{ minWidth: 120 }}>
//                   <FormControl fullWidth>
//                     <InputLabel id='is-payment-completed'>Payment Completed</InputLabel>
//                     <Select
//                       labelId='is-payment-completed'
//                       name='IsPaymentCompleted'
//                       value={isPaymentCompleted}
//                       label='Is Payment Completed'
//                       onChange={e => {
//                         setPaymentCompleted(e.target.value)
//                       }}
//                     >
//                       <MenuItem value='0'>No</MenuItem>
//                       <MenuItem value='50'>Yes</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label='Remarks'
//                   placeholder='Kadak Hai'
//                   onChange={e => setRemarks(e.target.value)}
//                 />
//               </Grid>
//             </Grid>
//           </CardContent>
//           <Divider sx={{ m: 0 }} />
//           <CardActions>
//             <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
//               Submit
//             </Button>
//             <Button size='large' color='secondary' variant='outlined'>
//               Cancel
//             </Button>
//           </CardActions>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// export default StockInward

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
