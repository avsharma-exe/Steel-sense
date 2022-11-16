import { Fragment, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import Menu from '@mui/material/Menu'
import Pencil from 'mdi-material-ui/Pencil'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import Exclamation from 'mdi-material-ui/Exclamation'
import CustomChip from 'src/@core/components/mui/chip'

import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import { PencilOutline, Download } from 'mdi-material-ui'
import useUserDetails from 'src/hooks/useUserDetails'

const BillOptions = ({ bill, viewBill, editBill, status }) => {
  const userDetails = useUserDetails()
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton size='small' onClick={handleRowOptionsClick} style={{ float: 'right' }}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={viewBill}>
          <EyeOutline fontSize='small' sx={{ mr: 2 }} />
          View
        </MenuItem>
        <MenuItem onClick={editBill}>
          {status === 0 ? (
            <span
              style={{
                color: '#FDBC3D'
              }}
            >
              <Exclamation fontSize='small' sx={{ mr: 2, mt: 2 }} />
              Edit
            </span>
          ) : (
            <>
              <Pencil fontSize='small' sx={{ mr: 2 }} />
              Edit
            </>
          )}
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default BillOptions
