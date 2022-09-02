import { useEffect, useState } from 'react'
import { secureApi } from 'src/helpers/apiGenerator'

import useUserDetails from 'src/hooks/useUserDetails'
import api_configs from 'src/configs/api_configs'
import displayDate from 'src/helpers/dateHelper'
import displayAmount from 'src/helpers/displayAmount'

import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'

import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import BasicTable from 'src/components/utils/BasicTable'

import { ClipboardListOutline } from 'mdi-material-ui'
import { useRouter } from 'next/router'

const AllBills = () => {
  const router = useRouter()
  const userDetails = useUserDetails()
  const [billEntries, setBillEntries] = useState([])

  const getAllBills = () => {
    secureApi
      .get(api_configs.stockInOut.getBillEntries, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          let billEntries = resp.data.allBillEntries.map(entry => {
            let newDate = entry.InvoiceDate.split('-')
            return {
              party_name: <Typography data={entry}>{entry.CompanyName}</Typography>,
              date: displayDate(new Date(newDate[2], parseInt(newDate[1]) - 1, newDate[0])),
              stock_name: entry.PName,
              qty: entry.Quantity + ' ' + entry.Unit,
              unit_price: '₹' + entry.UnitPrice + ' per ' + entry.Unit,

              tax: entry.TaxPercent === 0 ? '-' : entry.TaxPercent,
              total_price: '₹' + entry.TotalAmount,
              due_date: entry.DueOn ? entry.DueOn : '-'
            }
          })

          setBillEntries(billEntries)
        }
      })
  }

  // Call all bills when component mounts
  useEffect(() => getAllBills(), [])

  return (
    <>
      <Grid item md={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  Bill Entries <ClipboardListOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
                </Typography>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                  {userDetails.Role_ID == 4 ? null : (
                    <Button size='small' type='submit' variant='contained' onClick={() => {
                      router.push('/l2/add-bill')
                    }}>
                      Add New Bill
                    </Button>
                  )}
                </Box>
              </Box>
            }
          ></CardHeader>
          <CardContent>
            <BasicTable
              columns={[
                { id: 'date', label: 'Date', minWidth: 170 },
                { id: 'party_name', label: 'Party Name', minWidth: 170 },
                { id: 'stock_name', label: 'Stock Name', minWidth: 170 },
                { id: 'qty', label: 'Quantity', minWidth: 170 },
                { id: 'unit_price', label: 'Unit Price', minWidth: 170 },
                // { id: 'due', label: 'Due', minWidth: 170 },
                { id: 'tax', label: 'Tax', minWidth: 170 },
                { id: 'total_price', label: 'Total Price', minWidth: 170 },
                { id: 'due_date', label: 'Due Date', minWidth: 170 }
              ]}
              rows={billEntries}
              maxHeight={true}
              onRowClickHandle={row => {
                console.log(row)
                router.push(`/l2/edit-bill/${row.party_name.props.data.P_Stock_In_Voucher_ID}?company=${row.party_name.props.data.company}`)
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default AllBills
