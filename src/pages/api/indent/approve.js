import Indent from '../../../server/queries/Indent/Indent'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  // console.log(body)
  try {
    let updateIndentStatus = await Indent.Update.updateIndentStatus(!!body.update ? !!body.createStockInward ? 50 : 199 : 149, body.indent_particular)
    let updateIndentApprovedBy = await Indent.Update.updateIndentApprovedBy(body.user, body.indent)

    if (updateIndentStatus && updateIndentApprovedBy) {
      res.send({
        error: false,
        msg: 'Indent approved Successfully'
      })
    }
  } catch (e) {
    throw e
  }
}
