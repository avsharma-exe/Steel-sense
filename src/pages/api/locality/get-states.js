import { cryptPassword } from '../../../helpers/encrypt'
import Locality from '../../../server/queries/Locality/Locality'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }


  try {

      let states = await Locality.Read.getStates()
      console.log(states)


      if (states) {
        // TODO: add mail service to send the credentials
        res.send({
          error: false,
          states
        })
      }
  } catch (e) {
    throw e
  }
}
