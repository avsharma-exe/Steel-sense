// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// Table Imports
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'
import { alpha } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'

import Autocomplete from '@mui/material/Autocomplete'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import { InputAdornment } from '@mui/material'

import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import displayAmount from 'src/helpers/displayAmount'
import toast from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress'

const CreateMultiplePurchaseOrder = ({ indentsList, handleClose, allSuppliers }) => {
  const userDetails = useUserDetails()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [indents, setIndents] = useState(
    indentsList.map(indent => {
      return { ...indent, supplier: allSuppliers[0], qty: '', unit_p: '', expected_date: new Date(), total: 0 }
    })
  )
  const columns = [
    { id: 'StockName', label: 'Product', minWidth: 170 },
    { id: 'Division', label: 'Division', minWidth: 100 },
    {
      id: 'Qty',
      label: 'Quantity Requested',
      minWidth: 170
    },
    {
      id: 'supplier',
      label: 'Supplier',
      minWidth: 240
    },
    {
      id: 'expected_date',
      label: 'Expected Date',
      minWidth: 170
    },

    {
      id: 'qty',
      label: 'Quantity',
      minWidth: 170
    },

    {
      id: 'unit_p',
      label: 'Unit Price',
      minWidth: 170
    },

    {
      id: 'total',
      label: 'Total',
      minWidth: 170
    }
  ]

  const approveAndCreateMultipleOrder = async () => {
    setLoading(true)
    console.log("indents" , indents)
    const approvalList =
      indents &&
      indents.map(indent => {
        if (indent.qty !== '' && indent.unit_p !== '' && indent.total !== 0) {
          const date = new Date('2022-09-09T06:36:17.000Z')
          return {
            User_ID: userDetails.User_ID,
            Co_ID: userDetails.Co_ID,
            Div_ID: indent.indent.indent.Div_ID,
            P_ID: indent.indent.indent.P_ID,
            Supplier_ID: indent.supplier.Co_ID,
            Quantity: indent.qty,
            indent: indent.indent.indent.indent_particulars_id,
            Indent_ID: indent.indent.indent.indent_id,
            ExpectedDate: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
            inward: {
              status: 0,
              UnitPrice: indent.unit_p,
              DiscountPercent: '',
              TaxPercent: '',
              TotalAmount: indent.total
            }
          }
        }
        return null
      })

    console.log("approvalList" , approvalList)
    await secureApi
      .post(
        api_configs.indent.createMultiplePurchaseOrder,
        approvalList.filter(function (el) {
          return el != null
        })
      )
      .then(resp => {
        if (resp.status === 200) {
          // after approval
          toast.success('Approved & Purchase Order Created')
          handleClose()
        }
        setLoading(false)
      })
  }

  return (
    <Dialog fullScreen onClose={handleClose} aria-labelledby='full-screen-dialog-title' open={true}>
      <DialogTitle id='full-screen-dialog-title'>
        <Typography variant='h6' component='span'>
          Approve Multiple Indent Requests
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ top: 8, right: 10, position: 'absolute', color: theme => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {indentsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              row['supplier'] = (
                <Autocomplete
                  value={indents[index].supplier}
                  onChange={(event, value) => {
                    setIndents(current =>
                      current.map(obj => {
                        if (obj.indent.indent.indent_id === row.indent.indent.indent_id) {
                          return { ...obj, supplier: value }
                        }

                        return obj
                      })
                    )
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
              )
              row['expected_date'] = (
                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
                  <DatePicker
                    name='invoice_date'
                    fullWidth
                    label='Expected Date'
                    value={indents[index].expected_date}
                    onChange={e => {
                      setIndents(current =>
                        current.map(obj => {
                          if (obj.indent.indent.indent_id === row.indent.indent.indent_id) {
                            return { ...obj, expected_date: e }
                          }

                          return obj
                        })
                      )
                    }}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )
              row['qty'] = (
                <TextField
                  value={indents[index].qty}
                  type='number'
                  label='Quantity'
                  onChange={e => {
                    setIndents(current =>
                      current.map(obj => {
                        if (obj.indent.indent.indent_id === row.indent.indent.indent_id) {
                          return { ...obj, qty: e.target.value, total: indents[index].unit_p * e.target.value }
                        }

                        return obj
                      })
                    )
                  }}
                  placeholder='10'
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{row.indent.indent.UnitName}</InputAdornment>
                  }}
                />
              )
              row['unit_p'] = (
                <TextField
                  value={indents[index].unit_p}
                  onChange={e => {
                    setIndents(current =>
                      current.map(obj => {
                        if (obj.indent.indent.indent_id === row.indent.indent.indent_id) {
                          return { ...obj, unit_p: e.target.value, total: indents[index].qty * e.target.value }
                        }

                        return obj
                      })
                    )
                  }}
                  type='number'
                  label={'Unit Price per ' + row.indent.indent.UnitName}
                  placeholder='10'
                />
              )

              row['total'] = displayAmount(indents[index].unit_p * indents[index].qty)

              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code} >
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
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
          <Button color={'success'} onClick={() => approveAndCreateMultipleOrder()}>
            Approve & Create Purchase Order
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default CreateMultiplePurchaseOrder
