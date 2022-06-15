import executeQuery from '../../../../server/Connection'

const Read = {
  getCountries,
  getStates,
  getCities,
}

/**
 * Get countries
 */
function getCountries() {
  return executeQuery({
    query: `SELECT * from countries`,
  })
}

/**
 * Get states
 */
 function getStates() {
  return executeQuery({
    query: `SELECT * from states`,
  })
}

/**
 * Get cities
 */
 function getCities() {
  return executeQuery({
    query: `SELECT * from cities`,
  })
}


export default Read
