// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

const Filters = ({ divisions, addProductClickHandle, handleFilterChange, filters }) => {
  return (
    <Card sx={{ mb: 3, m: 2 }}>
      
      <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='role-select'>Select Division</InputLabel>
              <Select
                fullWidth
                value={filters.division}
                id='select-division'
                label='Select Division'
                onChange={e => handleFilterChange({ ...filters, division: e.target.value })}
                labelId='division-select'
                inputProps={{ placeholder: 'Select Division' }}
                style={{ fontSize: '0.6rem' }}
              >
                <MenuItem value={null}>Select Division</MenuItem>
                {divisions
                  ? divisions.map(div => {
                      return <MenuItem value={div.Div_ID}>{div.DivisionName}</MenuItem>
                    })
                  : null}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item sm={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='plan-select'>Select Status</InputLabel>
              <Select
                fullWidth
                value={filters.status}
                id='select-status'
                onChange={e => handleFilterChange({ ...filters, status: e.target.value })}
                label='Select Status'
                labelId='status-select'
                inputProps={{ placeholder: 'Select Status' }}
                style={{ fontSize: '0.6rem' }}
              >
                <MenuItem value={null}>Select Status</MenuItem>
                <MenuItem value='1'>Out of Stock</MenuItem>
                <MenuItem value='2'>In Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item sm={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='plan-select'>Products per page</InputLabel>
              <Select
                fullWidth
                value={filters.perPage}
                onChange={e => handleFilterChange({ ...filters, perPage: parseInt(e.target.value) })}
                id='select-product-per-page'
                label='Select Product per page'
                labelId='product-per-page-select'
                inputProps={{ placeholder: 'Select Plan' }}
                style={{ fontSize: '0.6rem' }}
              >
                <MenuItem value='6'>6</MenuItem>
                <MenuItem value='12'>12</MenuItem>
                <MenuItem value='24'>24</MenuItem>
                <MenuItem value='48'>48</MenuItem>
                <MenuItem value='96'>96</MenuItem>
                <MenuItem value='192'>192</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Button
              variant='contained'
              style={{
                width: '100%',
                height: '100%'
              }}
              onClick={() => addProductClickHandle()}
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Filters
