import Division from "src/server/queries/Division/Division"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  try {
    
    let date = new Date()

    
    body['CreatedDT'] =
      date.getFullYear() +
      '-' +
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()

    // add new user to UserMaster
    let result = await Division.Create.createNewDivision(body)
    

    if (result) {
      res.send({
        error: false,
        msg: 'Division Added Successfully',
      })
    }
  } catch (e) {
    throw e
  }
}
