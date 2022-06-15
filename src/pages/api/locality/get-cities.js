import { cryptPassword } from '../../../helpers/encrypt'
import Locality from '../../../server/queries/Locality/Locality'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }


  try {

      let cities = await Locality.Read.getCities()
      console.log(cities)


      if (cities) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          cities
        })
      }
  } catch (e) {
    throw e
  }
}
