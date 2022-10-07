// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import TableContainer from '@mui/material/TableContainer'

// ** Icons Imports
import Circle from 'mdi-material-ui/Circle'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import { BookCog } from 'mdi-material-ui'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

const data = [
  {
    title: 'In Stock',
    color: 'success',
    amount: '8'
  },
  {
    title: 'Bellow Limit',
    amount: '2',
    color: 'warning'
  }
]

const Analytics = ({ totalProducts = 0 }) => {
  return (
    <Card sx={{ width: '90%', mt: 6 }}>
      <CardHeader
        title='Insights'
        titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' } }}
        // action={
        //   <IconButton size='small' aria-label='settings' className='card-more-options'>
        //     <DotsVertical />
        //   </IconButton>
        // }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        <Box sx={{ mb: 5.75, display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 50, height: 50 }}>
            <BookCog sx={{ fontSize: '2rem' }} />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h4'>{totalProducts}</Typography>
            <Typography variant='caption'>Total Products</Typography>
          </Box>
        </Box>

        <Typography sx={{ mb: 1.5, fontWeight: 600 }}>Stock Insights</Typography>

        <LinearProgress
          value={80}
          variant='determinate'
          sx={{
            height: 10,
            '&.MuiLinearProgress-colorPrimary': { backgroundColor: 'warning.main' },
            '& .MuiLinearProgress-bar': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: 'success.main'
            }
          }}
        />

        <TableContainer>
          <Table>
            <TableBody>
              {data.map(row => {
                return (
                  <TableRow
                    key={row.title}
                    sx={{
                      '&:last-of-type td': { border: 0 },
                      '& .MuiTableCell-root': {
                        '&:last-of-type': { pr: 0 },
                        '&:first-of-type': { pl: 0 },
                        py: theme => `${theme.spacing(2.75)} !important`
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Circle sx={{ mr: 1.8, fontSize: '1rem', color: `${row.color}.main` }} />
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                          {row.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {row.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant='body2' sx={{ mr: 1.5, fontWeight: 600, color: 'text.primary' }}>
                          {row.trendNumber}
                        </Typography>
                        {row.trend}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default Analytics
