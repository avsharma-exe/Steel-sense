import Division from "src/server/queries/Division/Division"


export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  try {
      const roleDetails = body
      let date = new Date()
      roleDetails['UpdatedDT'] = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()

      // add new user to UserMaster
      let result = await Division.Update.updateCompanyDivision(body)

      if (result) {
        res.send({
          error: false,
          msg: 'Division updated successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
