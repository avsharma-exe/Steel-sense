import StockInOut from "src/server/queries/StockInOut/StockInOut"


export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).send({ message: 'Only PATCH requests allowed' })

    return
  }

  let body = req.body
  console.log(body)
  try {
      const roleDetails = body
      const inward_id = body.P_Stock_In_ID
      delete roleDetails.P_Stock_In_ID
      let date = new Date()
      roleDetails['UpdatedDT'] = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      roleDetails['UpdateBy'] = body.user_id
      delete roleDetails.user_id
      // add new user to UserMaster
      console.log(roleDetails , inward_id)
      let result = await StockInOut.Update.updateBillEntry(roleDetails, inward_id)
      console.log(result)
      if (result) {
        res.send({
          error: false,
          msg: 'Bill Entry Done successfully',
          result,
        })
      }
  } catch (e) {
    throw e
  }
}
