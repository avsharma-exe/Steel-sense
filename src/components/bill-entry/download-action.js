// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icons Imports
import SendOutline from 'mdi-material-ui/SendOutline'

const OptionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const Actions = ({ saveBill, updateLoader }) => {
  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Button fullWidth sx={{ mb: 3.5 }} variant='contained' color={"success"} startIcon={<SendOutline />} onClick={saveBill}>
            {updateLoader ? (
              <CircularProgress
                sx={{
                  color: 'common.white',
                  width: '20px !important',
                  height: '20px !important',
                  mr: theme => theme.spacing(2)
                }}
              />
            ) : (
              'Download'
            )}
          </Button>

          <Button fullWidth variant='outlined' sx={{ mb: 3.5 }}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Actions
