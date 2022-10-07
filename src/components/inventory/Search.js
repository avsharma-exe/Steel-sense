// ** MUI Imports
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import { IconButton } from '@mui/material'

// ** Icons Imports
import { SearchWeb } from 'mdi-material-ui'

const Search = ({ searchTerm, handleOnChange }) => {
  return (
    <Grid item>
      <OutlinedInput
        id='icons-adornment-search'
        value={searchTerm}
        onChange={e => handleOnChange(e.target.value)}
        style={{ backgroundColor: 'white', color: 'black', width: '90%' }}
        placeholder={'Search here'}
        aria-describedby='icons-search-helper-text'
        endAdornment={
          <InputAdornment position='end'>
            {' '}
            <IconButton edge='end' aria-label='search button'>
              <SearchWeb fontSize='small' />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search'
        }}
      />
    </Grid>
  )
}

export default Search
