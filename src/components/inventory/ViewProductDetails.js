// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CustomChip from 'src/@core/components/mui/chip'
import Exclamation from 'mdi-material-ui/Exclamation'
import CheckCircle from 'mdi-material-ui/CheckCircle'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import useUserDetails from 'src/hooks/useUserDetails'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import CircularProgress from '@mui/material/CircularProgress'

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

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const DivisionCard = ({ stock, product }) => {
  return (
    <Card sx={{ m: 1, mb: 3 }}>
      <CardContent sx={{ p: theme => `${theme.spacing(4, 5)} !important` }}>
        <CustomChip size='small' skin='light' color='primary' label={stock.DivisionName} sx={{ mb: 4 }} />

        <Typography variant='body2'>
          <b>Stock - </b>
          {stock.CurrentStock > stock.LowStockLimit ? ( // <Chip label={product.CurrentStock} color='success' />
            <CustomChip
              size='small'
              skin='light'
              color='success'
              label={stock.CurrentStock + ' ' + product.Unit}
              icon={<CheckCircle fontSize='small' />}
            />
          ) : (
            // <Chip label={product.CurrentStock} color='danger' />
            <CustomChip
              size='small'
              skin='light'
              color='error'
              label={stock.CurrentStock + ' ' + product.Unit}
              icon={<Exclamation fontSize='small' />}
            />
          )}
        </Typography>
        <Typography variant='body2'>
          <b>Max Stock Limit - </b>
          <span>
            {stock.MaxStockLimit} {product.Unit}
          </span>
        </Typography>

        <Typography variant='body2'>
          <b>Low Stock Limit - </b>
          <span>
            {stock.LowStockLimit} {product.Unit}
          </span>
        </Typography>
      </CardContent>
    </Card>
  )
}

const ViewProductDetails = ({ show, product, handleClose }) => {
  const [productDetails, setProductDetails] = useState({})
  const [productStock, setProductStock] = useState([])
  const [loader, setLoader] = useState(false)

  const getProductDetails = async () => {
    setLoader(true)
    const productDetails = await secureApi.get(api_configs.product.getProductByID, {
      params: {
        product: product.P_ID,
        division: -1
      }
    })

    if (productDetails.status === 200) {
      setProductDetails(productDetails.data.product.length > 0 ? productDetails.data.product[0] : {})
      setProductStock(productDetails.data.p_stock.length > 0 ? productDetails.data.p_stock : [])
      setLoader(false)
    }
  }

  useEffect(() => {
    getProductDetails()
  }, [product])

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
        <Typography variant='h6'>Product Details</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <Typography sx={{ mb: 6 }}>
          <b>Product - </b>
          <span style={{ fontSize: '20px' }}>
            {loader ? (
              <CircularProgress
                sx={{
                  color: 'common.black',
                  width: '20px !important',
                  height: '20px !important',
                  mr: theme => theme.spacing(2)
                }}
              />
            ) : productDetails ? (
              productDetails.PName
            ) : (
              ''
            )}
          </span>
        </Typography>

        <Typography sx={{ mb: 6 }}>
          <b>Unit - </b>
          <span style={{ fontSize: '20px' }}>
            {loader ? (
              <CircularProgress
                sx={{
                  color: 'common.black',
                  width: '20px !important',
                  height: '20px !important',
                  mr: theme => theme.spacing(2)
                }}
              />
            ) : productDetails ? (
              productDetails.UnitName
            ) : (
              ''
            )}
          </span>
        </Typography>

        {loader ? (
          <CircularProgress
            sx={{
              color: 'common.black',
              width: '20px !important',
              height: '20px !important',
              mr: theme => theme.spacing(2)
            }}
          />
        ) : (
          productStock.map(stock => {
            return <DivisionCard stock={stock} product={product} />
          })
        )}
      </Box>
    </Drawer>
  )
}

export default ViewProductDetails
