import { Fragment, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import Menu from '@mui/material/Menu'
import EyeOutline from 'mdi-material-ui/EyeOutline'


import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import { PencilOutline, Download } from 'mdi-material-ui'
import useUserDetails from 'src/hooks/useUserDetails'
const CardOptions = ({ onEditHandle, onUseStockHandle, onViewStockHandle }) => {
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
        {userDetails.Role_ID === 4 ? (
          <MenuItem onClick={onUseStockHandle}>
            <Download fontSize='small' sx={{ mr: 2 }} />
            Use Stock
          </MenuItem>
        ) : null}

        {userDetails.Role_ID !== 4 ? (
          <MenuItem onClick={onViewStockHandle}>
            <EyeOutline fontSize='small' sx={{ mr: 2 }} />
            View
          </MenuItem>
        ) : null}

        {userDetails.Role_ID !== 4 ? (
          <MenuItem onClick={onEditHandle}>
            <PencilOutline fontSize='small' sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        ) : null}
      </Menu>
    </Fragment>
  )
}

export default CardOptions
