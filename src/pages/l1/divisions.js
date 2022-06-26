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
import api_configs from '../../configs/api_configs'
import TableActions from '../../components/utils/TableActions'
import { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useUserDetails from '../../hooks/useUserDetails'
import toast from 'react-hot-toast'
import { getStatusText } from 'src/helpers/statusHelper'
import { Box } from '@mui/material'

const Divisions = () => {
  const [allDivisions, setAllDivision] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState({})
  const [openNew, setOpenNew] = useState(false)
  const [newRowData, setNewRowData] = useState({})

  const editRow = rowData => {
    setOpen(true)
    setSelectedRowData(rowData)
  }

  const addNew = () => {
    setOpenNew(true)
  }

  const userDetails = useUserDetails()

  const handleClose = () => {
    setOpen(false)
  }

  const handleEditRow = async () => {
    await secureApi
      .patch(api_configs.division.update, {
        Div_ID: selectedRowData.Div_ID,
        DivisionName: selectedRowData.DivisionName,
        Co_ID: userDetails.Co_ID,
        UpdateBy: userDetails.User_ID
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Updated SuccessFully')
          handleClose()
        }
      })
  }

  const handleAddNew = async () => {
    await secureApi
      .post(api_configs.division.createNew, {
        DivisionName: newRowData.DivisionName,
        Co_ID: userDetails.Co_ID,
        CreatedBy: userDetails.User_ID
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Added Successfully')
          getAllDivisions()
          setOpenNew(false)
        }
      })
  }

  const getAllDivisions = async () => {
    await secureApi.get(api_configs.division.getAll, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.data.allDivisions.length > 0) {
        let allDivision = []
        res.data.allDivisions.map(role => {
          allDivision.push({
            name: role.DivisionName,
            status: role.status,
            actions: <TableActions editRow={rowData => editRow(rowData)} row={role} />
          })
        })
        setAllDivision(allDivision)
      }
    })
  }

  useEffect(() => {
    getAllDivisions()
  }, [open, openNew])

  // useEffect(() => {
  //   handleEditRow()
  // }, [])

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Edit Division</DialogTitle>
        <DialogContent>
          <TextField
            id='name'
            autoFocus
            fullWidth
            type='text'
            label='Role Name'
            value={selectedRowData.DivisionName}
            onChange={e => setSelectedRowData({ ...selectedRowData, DivisionName: e.target.value })}
            sx={{ w: '100%', mt: '5px' }}
          />
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => handleEditRow()}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Add new Role */}
      <Dialog open={openNew} onClose={() => setOpenNew(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Add Division</DialogTitle>
        <DialogContent>
          <TextField
            id='name'
            fullWidth
            type='text'
            label='Division Name'
            onChange={e => setNewRowData({ ...newRowData, DivisionName: e.target.value })}
            sx={{ w: '100%', mt: '5px' }}
          />
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => handleAddNew()}>Add</Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant={'h6'}>
                All Divisions <Domain sx={{ ml: 2, color: theme => theme.palette.success.main }} />
              </Typography>
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                <Button size='small' type='submit' variant='contained' onClick={() => addNew()}>
                  Add Division
                </Button>
              </Box>
            </Box>
          }
        />
        {/* <Divider /> */}

        <CardContent>
          <BasicTable
            columns={[
              { id: 'name', label: 'Name', minWidth: 170 },

              { id: 'actions', label: 'Actions', minWidth: 170 }
            ]}
            rows={allDivisions}
            onRowClickHandle={rowData => {}}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Divisions
