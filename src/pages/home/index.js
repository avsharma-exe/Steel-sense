// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DownloadOutline from 'mdi-material-ui/DownloadOutline'
import Domain from 'mdi-material-ui/Domain'

import DatabaseAlertOutline from 'mdi-material-ui/DatabaseAlertOutline'
import TicketConfirmationOutline from 'mdi-material-ui/TicketConfirmationOutline'
import BasicTable from 'src/components/utils/BasicTable'
import Button from '@mui/material/Button'
import Send from 'mdi-material-ui/Send'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import TableActions from '../../components/utils/TableActions'
import { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useUserDetails from "../../hooks/useUserDetails"
import toast from 'react-hot-toast'
import { getStatusText } from 'src/helpers/statusHelper'

const L3Dashboard = () => {
  <Grid container spacing={6}>
    <Grid item md={6}>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              Incoming Order Details <DownloadOutline sx={{ ml: 2, color: theme => theme.palette.success.main }} />
            </Typography>
          }
        ></CardHeader>
        {/* <Divider /> */}

        <CardContent>
          <BasicTable
            columns={[
              { id: 'name', label: 'Name', minWidth: 170 },
              { id: 'qty', label: 'Quantity', minWidth: 170 },
              { id: 't_info', label: 'Truck Info', minWidth: 170 }
            ]}
            rows={[
              { name: 'Ak-47', qty: '10', t_info: 'MH-49-AD-1867' },
              { name: 'Desert Eagle', qty: '8', t_info: 'MH-49-AD-1866' },
              { name: 'SCAR-L', qty: '18', t_info: 'MH-49-AD-1865' },
              { name: 'Negev', qty: '1', t_info: 'MH-49-AD-1864' }
            ]}
          />
        </CardContent>
      </Card>
    </Grid>
    <Grid item md={6}>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              Low Stock Alert <DatabaseAlertOutline sx={{ ml: 2, color: theme => theme.palette.error.main }} />
            </Typography>
          }
        ></CardHeader>
        {/* <Divider /> */}
        <CardContent>
          <BasicTable
            columns={[
              { id: 'name', label: 'Name', minWidth: 170 },
              { id: 'qty', label: 'Quantity / Max Quantity', minWidth: 170 },
              { id: 're_order_button', label: 'Reorder', minWidth: 170 }
            ]}
            rows={[
              {
                name: 'Ak-47',
                qty: '1/4',
                re_order_button: (
                  <Button variant='contained' endIcon={<Send />} style={{ color: 'white' }}>
                    Create Indent
                  </Button>
                )
              },
              {
                name: 'RDX',
                qty: '1/3',
                re_order_button: (
                  <Button variant='contained' endIcon={<Send />} style={{ color: 'white' }}>
                    Create Indent
                  </Button>
                )
              }
            ]}
          />
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12}>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              Indent <TicketConfirmationOutline sx={{ ml: 2, color: theme => theme.palette.primary.main }} />
            </Typography>
          }
        ></CardHeader>
        <CardContent>
          <BasicTable
            columns={[
              { id: 'name', label: 'Name' },
              { id: 'qty', label: 'Quantity' },
              { id: 'liod', label: 'Last Incoming Order Date' },
              { id: 'eta', label: 'ETA' },
              { id: 'status', label: 'Status' }
            ]}
            rows={[
              { name: 'Ak-47', qty: '150', liod: 'Wed Jun 04 2022', eta: 'Wed Jun 08 2022', status: 'Under Approval' },
              { name: 'RDX', qty: '15', liod: 'Wed Jun 03 2022', eta: 'Wed Jun 10 2022', status: 'Under Approval' }
            ]}
          />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
}

const Home = () => {
  const [allCompanies, setAllCompanies] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState({})
  const editRow = rowData => {
    setOpen(true)
    setSelectedRowData(rowData)
  }

  const userDetails = useUserDetails()

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditRow = async () => {
    await secureApi.patch(api_configs.company.updateCompany, {
          CompanyName: selectedRowData.CompanyName,
          status: selectedRowData.status,
          company_ID: selectedRowData.Co_ID,
          user: userDetails.User_ID,
        })
        .then(resp => {
          if (resp.status === 200) {
            toast.success('Form Submitted')
            handleClose()
          }
        })
  }

  const getAllCompanies = () => {
    secureApi.get(api_configs.company.getAll).then(res => {
      if (res.data.allCompanies.length > 0) {
        let allCompanies = []
        res.data.allCompanies.map(company => {
          allCompanies.push({
            name: company.CompanyName,
            status: getStatusText(company.status),
            createdby: company.FirstName + ' ' + company.LastName,
            actions: <TableActions editRow={rowData => editRow(rowData)} row={company} />
          })
        })
        setAllCompanies(allCompanies)
      }
    })
  }

  useEffect(() => {
    getAllCompanies()
  }, [open])
  // useEffect(() => {
  //   handleEditRow()
  // }, [])

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Company Details</DialogTitle>
        <DialogContent>
          <TextField
            id='name'
            autoFocus
            fullWidth
            type='text'
            label='Company Name'
            value={selectedRowData.CompanyName}
            onChange={e => setSelectedRowData({ ...selectedRowData, CompanyName: e.target.value })}
            sx={{ w: '100%', mt: '5px' }}
          />
        </DialogContent>
        <DialogContent>
          <Select
            value={selectedRowData.status}
            label='Status'
            onChange={(e) => setSelectedRowData({...selectedRowData, status: e.target.value})}
            style={{width: "100%", marginTop: "5px"}}

          >
            <MenuItem value='0'>Draft</MenuItem>
            <MenuItem value='50'>Active</MenuItem>
            <MenuItem value='99'>Inactive</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => handleEditRow()}>Update</Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Typography variant={'h6'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              All Companies <Domain sx={{ ml: 2, color: theme => theme.palette.success.main }} />
            </Typography>
          }
        ></CardHeader>
        {/* <Divider /> */}

        <CardContent>
          <BasicTable
            columns={[
              { id: 'name', label: 'Name', minWidth: 170 },
              { id: 'status', label: 'Status', minWidth: 170 },
              { id: 'createdby', label: 'Created By', minWidth: 170 },
              { id: 'actions', label: 'Actions', minWidth: 170 }
            ]}
            rows={allCompanies}
            onRowClickHandle={rowData => {}}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Home
