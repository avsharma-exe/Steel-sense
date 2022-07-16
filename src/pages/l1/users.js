// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Domain from 'mdi-material-ui/Domain'

import BasicTable from 'src/components/utils/BasicTable'
import Button from '@mui/material/Button'

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
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Divider } from '@mui/material'
import { getStatusText } from 'src/helpers/statusHelper'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import { findDOMNode } from 'react-dom'
import AddNewUser from 'src/components/users/AddNewUser'

const Users = () => {
  const [loader, setLoader] = useState(false)
  const [allRoles, setAllRoles] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allDivisions, setAllDivision] = useState([])
  const [l1Users, setL1Users] = useState([])
  const [l2Users, setL2Users] = useState([])
  const [l3Users, setL3Users] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState({})
  const [openNew, setOpenNew] = useState(false)
  const [newRowData, setNewRowData] = useState({})
  const [addUserOpen, setAddUserOpen] = useState(false)

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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleEditRow = async () => {
    // console.log(selectedRowData)
    await secureApi
      .patch(api_configs.user.updateCompanyUser, {
        Role_ID: selectedRowData.Role_ID,
        Div_ID: selectedRowData.Div_ID,
        status: selectedRowData.status,
        Company_User_ID: selectedRowData.Company_User_ID
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Form Submitted')
          handleClose()
        }
      })
  }

  const handleAddNew = async () => {
    // console.log('aaa')
  }

  const getAllUsers = async () => {
    setLoader(true)
    await secureApi.get(api_configs.user.getAllCompanyUser, { params: { coid: userDetails.Co_ID } }).then(res => {
      if (res.status === 200) {
        let users = []
        if (res.data.allUsers) {
          res.data.allUsers.map(user => {
            users.push({
              firstName: user.FirstName,
              lastName: user.LastName,
              division: user.DivisionName,
              role: user.Role_ID,
              description: user.RoleDescription,
              status: getStatusText(user.status),
              actions: <TableActions editRow={rowData => editRow(rowData)} row={user} />
            })
          })
        }
        setAllUsers(users)
      }
    })
    setLoader(false)
  }

  const getDivisions = async () => {
    await secureApi
      .get(api_configs.division.getAll, { params: { coid: userDetails.Co_ID } })
      .then(res => {
        if (res.status === 200) {
          setAllDivision(res.data.allDivisions)
          // console.log(res.data.allDivisions)
        }
      })
      .then(
        secureApi.get(api_configs.role.getAll).then(res => {
          setAllRoles(res.data.allRoles)
          // console.log(res.data.allRoles)
        })
      )
  }

  useEffect(() => {
    getAllUsers(), getDivisions()
  }, [open, openNew])
  useEffect(() => {
    setL1Users(
      allUsers.filter(l1user => {
        if (l1user.role === 2) {
          return l1user
        }
      })
    )
    setL2Users(
      allUsers.filter(l2user => {
        if (l2user.role === 3) {
          return l2user
        }
      })
    )
    setL3Users(
      allUsers.filter(l3user => {
        if (l3user.role === 4) {
          return l3user
        }
      })
    )
  }, [allUsers])

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Users/Employees</DialogTitle>
        <DialogContent>
          <TextField
            disabled={true}
            id='firstName'
            fullWidth
            type='text'
            label='First Name'
            value={selectedRowData.FirstName}
            sx={{ w: '100%', mt: '5px' }}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            id='lastName'
            disabled={true}
            fullWidth
            type='text'
            label='Last Name'
            value={selectedRowData.LastName}
            sx={{ w: '100%', mt: '5px' }}
          />
        </DialogContent>
        <DialogContent>
          <Autocomplete
            sx={{ w: '100%', mt: '5px' }}
            value={
              allDivisions
                ? allDivisions.find(division => {
                    if (division.Div_ID === selectedRowData.Div_ID) return division.DivisionName
                  })
                : null
            }
            onChange={(event, value) => {
              if (value) setSelectedRowData({ ...selectedRowData, Div_ID: value.Div_ID })

              // console.log(selectedRowData.DivisionName)
            }}
            options={allDivisions}
            getOptionLabel={option => option.DivisionName}
            renderOption={(props, option) => <Box {...props}>{option.DivisionName}</Box>}
            renderInput={params => (
              <TextField
                {...params}
                name='divsion'
                label='Choose a Division'
                inputProps={{
                  ...params.inputProps
                }}
                sx={{ w: '100%', mt: '5px' }}
              />
            )}
          />
        </DialogContent>
        <DialogContent>
          <Autocomplete
            sx={{ w: '100%', mt: '5px' }}
            value={
              allRoles
                ? allRoles.find(role => {
                    if (role.Role_ID === selectedRowData.Role_ID) return role.RoleName
                  })
                : null
            }
            onChange={(event, value) => {
              if (value) setSelectedRowData({ ...selectedRowData, Role_ID: value.Role_ID })

              // console.log(selectedRowData.Role_ID)
            }}
            options={allRoles}
            getOptionLabel={option => option.RoleName}
            renderOption={(props, option) => <Box {...props}>{option.RoleName}</Box>}
            renderInput={params => (
              <TextField
                {...params}
                name='role'
                label='Choose a Role'
                inputProps={{
                  ...params.inputProps
                }}
                sx={{ w: '100%', mt: '5px' }}
              />
            )}
          />
        </DialogContent>
        <DialogContent>
          <Select
            value={selectedRowData.status}
            label='Status'
            onChange={e => setSelectedRowData({ ...selectedRowData, status: e.target.value })}
            style={{ width: '100%', marginTop: '5px' }}
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

      <AddNewUser open={addUserOpen} toggle={toggleAddUserDrawer} />

      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant={'h5'}>
                All Users <Domain sx={{ ml: 2, color: theme => theme.palette.success.main }} />
              </Typography>
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                <Button size='small' type='submit' variant='contained' onClick={() => toggleAddUserDrawer()}>
                  Add User
                </Button>
              </Box>
            </Box>
          }
        />
        {/* <Divider /> */}

        <CardContent>
          <Typography variant={'h6'}>L1 (Owners)</Typography>
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
            <BasicTable
              columns={[
                { id: 'firstName', label: 'First Name', minWidth: 170 },
                { id: 'lastName', label: 'Last Name', minWidth: 170 },
                { id: 'division', label: 'Division', minWidth: 170 },
                { id: 'description', label: 'Description', minWidth: 170 },
                { id: 'status', label: 'Status', minWidth: 170 },
                { id: 'actions', label: 'Action', minWidth: 170 }
              ]}
              rows={l1Users}
              onRowClickHandle={rowData => {}}
            />
          )}
        </CardContent>
      </Card>

      <Divider></Divider>

      <Card>
        {l2Users.length ? (
          <CardContent>
            <Typography variant={'h6'}>L2 (Employee)</Typography>
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
              <BasicTable
                columns={[
                  { id: 'firstName', label: 'First Name', minWidth: 170 },
                  { id: 'lastName', label: 'Last Name', minWidth: 170 },
                  { id: 'division', label: 'Division', minWidth: 170 },
                  { id: 'description', label: 'Description', minWidth: 170 },
                  { id: 'status', label: 'Status', minWidth: 170 },
                  { id: 'actions', label: 'Action', minWidth: 170 }
                ]}
                rows={l2Users}
                onRowClickHandle={rowData => {}}
              />
            )}
          </CardContent>
        ) : (
          <CardContent>
            <Typography>No L2 Users Please create One</Typography>
          </CardContent>
        )}
      </Card>
      <Divider></Divider>
      <Card>
        {l3Users.length ? (
          <CardContent>
            <Typography variant={'h6'}>L3 (Employee)</Typography>
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
              <BasicTable
                columns={[
                  { id: 'firstName', label: 'First Name', minWidth: 170 },
                  { id: 'lastName', label: 'Last Name', minWidth: 170 },
                  { id: 'division', label: 'Division', minWidth: 170 },
                  { id: 'description', label: 'Description', minWidth: 170 },
                  { id: 'status', label: 'Status', minWidth: 170 },
                  { id: 'actions', label: 'Action', minWidth: 170 }
                ]}
                rows={l3Users}
                onRowClickHandle={rowData => {}}
              />
            )}
          </CardContent>
        ) : (
          <CardContent>
            <Typography>No L3 Users Please create One</Typography>
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default Users
