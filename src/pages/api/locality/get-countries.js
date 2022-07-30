import { cryptPassword } from '../../../helpers/encrypt'
import Locality from '../../../server/queries/Locality/Locality'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }


  try {

      let countries = await Locality.Read.getCountries()
      // console.log(countries)


      if (countries) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          countries
        })
      }
  } catch (e) {
    throw e
  }
}
