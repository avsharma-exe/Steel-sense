import { useEffect, useState } from 'react'
import { secureApi } from 'src/helpers/apiGenerator'

import useUserDetails from 'src/hooks/useUserDetails'
import api_configs from 'src/configs/api_configs'
import displayDate from 'src/helpers/dateHelper'
import displayAmount from 'src/helpers/displayAmount'

import Box from '@mui/material/Box'
import CustomChip from 'src/@core/components/mui/chip'
import Exclamation from 'mdi-material-ui/Exclamation'
import CheckCircle from 'mdi-material-ui/CheckCircle'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'

import { Grid, Card, CardHeader, Typography, CardContent, Button } from '@mui/material'
import BasicTable from 'src/components/utils/BasicTable'

import { ClipboardListOutline } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { displayInitials } from 'src/helpers/displayInitials'
import BillOptions from 'src/components/bill-entry/billOptions'

const AllBills = () => {
  const router = useRouter()
  const userDetails = useUserDetails()
  const [singleBillEntries, setSingleBillEntries] = useState([])
  const [billEntries, setBillEntries] = useState([])

  const getSingleBills = async () => {
    await secureApi
      .get(api_configs.billEntry.getSingleBillEntries, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          let billEntries = resp.data.allBills.map(entry => {
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

          setSingleBillEntries(billEntries)
        }
      })
  }

  const getBillEntries = async () => {
    await secureApi
      .get(api_configs.billEntry.getBillEntries, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          let billEntries = resp.data.allBills.map(entry => {
            return {
              supplier: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {displayInitials(entry.CompanyName)}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      noWrap
                      variant='body2'
                      sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                    >
                      {entry.CompanyName}
                    </Typography>
                    <Typography noWrap variant='caption'>
                      {/* {companyEmail} */}
                    </Typography>
                  </Box>
                </Box>
              ),
              Bill_Name: <Typography data={entry}>{entry.Bill_Name == '' ? 'NA' : '# ' + entry.Bill_Name}</Typography>,
              status: renderStatus(entry.status, entry.DueOn),
              sub_total: displayAmount(entry.SubTotal),
              tax: entry.Tax == null ? 'NA' : entry.Tax + '%',
              discount: entry.Discount == null ? 'NA' : entry.Discount + '%',
              total: displayAmount(entry.Total),
              invoice_date: entry.InvoiceDate == null ? 'NA' : displayDate(new Date(entry.InvoiceDate)),
              due_date: entry.DueOn == null ? 'NA' : displayDate(new Date(entry.DueOn)),
              options: (
                <BillOptions
                  status={entry.status}
                  bill={entry}
                  viewBill={() => {
                    router.push(`/l2/view-bill/multiple/${entry.Bill_Entry_ID}?supplier=${entry.Supplier_ID}`)
                  }}
                  editBill={() => {
                    router.push(`/l2/edit-bill/multiple/${entry.Bill_Entry_ID}?supplier=${entry.Supplier_ID}`)
                  }}
                />
              )
            }
          })

          setBillEntries(billEntries)
        }
      })
  }

  const renderStatus = (status, DueOn) => {
    const dueDate = new Date(DueOn)
    const currentDate = new Date()
    if (DueOn !== null && currentDate.getTime() < dueDate.getTime())
      return (
        <CustomChip
          size='small'
          skin='light'
          color='error'
          label={'Bill Due'}
          icon={<Exclamation fontSize='small' />}
        />
      )

    switch (status) {
      case 0:
        return (
          <CustomChip
            size='small'
            skin='light'
            color='warning'
            label={'Action Required'}
            icon={<Exclamation fontSize='small' />}
          />
        )
      case 49:
        return (
          <CustomChip
            size='small'
            skin='light'
            color='success'
            label={'Bill Generated'}
            icon={<CheckCircle fontSize='small' />}
          />
        )
      default:
        ;<CustomChip
          size='small'
          skin='light'
          color='warning'
          label={'Error Occured'}
          icon={<Exclamation fontSize='small' />}
        />
    }
  }

  // Call all bills when component mounts
  useEffect(() => {
    Promise.all([getSingleBills(), getBillEntries()])
  }, [])

  return (
    <>
      <Grid item md={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  Bills Entries <ClipboardListOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
                </Typography>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                  {userDetails.Role_ID == 4 ? null : (
                    <Button
                      size='small'
                      type='submit'
                      variant='contained'
                      onClick={() => {
                        router.push('/l2/add-bill')
                      }}
                    >
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
                { id: 'supplier', label: 'Supplier Name', minWidth: 270 },
                { id: 'Bill_Name', label: 'Bill ID', minWidth: 170 },
                { id: 'invoice_date', label: 'Invoice Date', minWidth: 170 },
                { id: 'due_date', label: 'Due Date', minWidth: 170 },
                { id: 'status', label: 'Status', minWidth: 170 },

                { id: 'total', label: 'Total', minWidth: 170 },
                { id: 'options', label: 'Options', minWidth: 5 }
              ]}
              rows={billEntries}
              maxHeight={true}
              // onRowClickHandle={row => {
              //   switch (row.Bill_Name.props.data.status) {
              //     case 0:
              //       router.push(
              //         `/l2/edit-bill/multiple/${row.Bill_Name.props.data.Bill_Entry_ID}?supplier=${row.Bill_Name.props.data.Supplier_ID}`
              //       )
              //       break
              //     case 49:
              //       router.push(
              //         `/l2/view-bill/multiple/${row.Bill_Name.props.data.Bill_Entry_ID}?supplier=${row.Bill_Name.props.data.Supplier_ID}`
              //       )
              //   }
              // }}
            />
          </CardContent>
        </Card>
      </Grid>
      <br />
      {/* <Grid item md={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  Single Bills <ClipboardListOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
                </Typography>
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
              rows={singleBillEntries}
              maxHeight={true}
              onRowClickHandle={row => {
                router.push(
                  `/l2/edit-bill/${row.party_name.props.data.P_Stock_In_Voucher_ID}?company=${row.party_name.props.data.company}`
                )
              }}
            />
          </CardContent>
        </Card>
      </Grid> */}
    </>
  )
}

export default AllBills
