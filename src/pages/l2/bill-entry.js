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

  const userDetails = useUserDetails()

  const [entries, setAllEntries] = useState(null)
  const [status, setStatus] = useState(99)
  const [InvoiceDate, setInvoiceDate] = useState(new Date())
  const [taxPercent, setTax] = useState(null)
  const [billAmount, setBillAmount] = useState(null)

  const getBillEntry = async () => {
    await secureApi.get(api_configs.stockInOut.getAllInwards, {
      params: {
        company: userDetails.Co_ID,
      }
    }).then(resp => {
      console.log(resp.data.allInwards)
      setAllEntries(resp.data.allInwards[0])
    })
  }

  useEffect(() => {
    getBillEntry()
  }, [])

  const handleSubmit = async (e)=> {
    e.preventDefault()
    //TODO: rowData me row ka data aayega jo select hogi fir sahi se set kar k uncomment kar dena
    let body = {
      // P_Stock_In_ID: rowData.P_Stock_In_ID,
      DueOn: InvoiceDate.getFullYear() + "-" + parseInt(InvoiceDate.getMonth() + 1) + "-" + InvoiceDate.getDate() + " " + InvoiceDate.getHours() + ":" + InvoiceDate.getMinutes(),
      TaxPercent: taxPercent,
      BillAmount: billAmount,
      status: status,
      user_id: userDetails.User_ID
    }
    console.log(body)
    //TODO: jab updar row data se stock Inward Id aa jaaye toh call karna ye api
    // await secureApi.patch(api_configs.stockInOut.updateBillEntry, body).then(res => {
    //   console.log(res)
    // })
    }
  return (
    <Card>
      <CardHeader title='Bill Entry' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ minHeight: 500, display: 'flex' }}>
        <form onSubmit={e => handleSubmit(e)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value = {entries ? entries.PName : null}
              disabled

            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              // label='Quantity'
              value = {entries ? entries.Quantity + '       ' + entries.Unit : null}
              disabled

            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              // label='Supplier Name'
              value = {entries ? entries.SupplierName : null}
              disabled

            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              labelId="payment_status"
              id="p_status"
              value={status}
              label="Payment Status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value={99}>Is Due</MenuItem>
              <MenuItem value={199}>Paid</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
                <DatePicker
                  fullWidth
                  label='Payment/Due Date'
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
              label='Amount without GST'
              placeholder='100000'
              value = {billAmount ? billAmount : null}
              onChange={e => setBillAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='GST'
              placeholder='2'
              value = {taxPercent ? taxPercent : null}
              onChange={e => setTax(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Total with GST'
              placeholder='102000'
            />
          </Grid>
        </Grid>

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


