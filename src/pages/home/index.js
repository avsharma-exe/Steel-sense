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

import Divider from '@mui/material/Divider'
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import { useEffect, useState } from 'react'
const L3Dashboard = () => {
  ;<Grid container spacing={6}>
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
  const [allCompanies , setAllCompanies] = useState([])
  const getAllCompanies = () => {
    secureApi.get(api_configs.company.getAll).then(res => {
      if(res.data.allCompanies.length > 0){
        let allCompanies = []
        res.data.allCompanies.map(company => {
          allCompanies.push({
            name: company.CompanyName,
            status: company.status,
            createdon: company.CreatedDT,
            createdby: company.FirstName + " " + company.LastName
          })
        })
        setAllCompanies(allCompanies)
      }
    })
  }

  useEffect(() => {
    getAllCompanies()
  }, [])

  return (
    <>
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
              { id: 'createdon', label: 'Created On', minWidth: 170 },
              { id: 'createdby', label: 'Created By', minWidth: 170 }

            ]}
            rows={allCompanies}
            onRowClickHandle={(rowData) => {

            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Home
