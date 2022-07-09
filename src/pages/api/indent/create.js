import Indent from '../../../server/queries/Indent/Indent'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })

    return
  }

  let body = req.body
  console.log(body)
  try {
      const indent = body.indent
      indent['CreatedBy'] = body.indent.user
      let date = new Date()
      let CreatedDt = date.getFullYear() +
      '-' + parseInt(date.getMonth() + 1) +
      '-' + date.getDate() +
      ' ' + date.getHours() +
      ':' + date.getMinutes()
      indent['CreatedDt'] = CreatedDt
      indent['IndentNo'] = 1
      delete indent.user

      const indent_particular = body.indent_particulars
      indent_particular['CreatedBy'] = body.indent.user
      indent_particular['CreatedDt'] = CreatedDt

      // add new indent to P_Stock_Indent
      let result = await Indent.Create.createNewIndent(indent)
      indent_particular['P_Stock_Indent_ID'] = result.insertId
      let indent_particular_data = await Indent.Create.createNewIndentParticulars(indent_particular)

      if (result && indent_particular_data) {
        // TODO: add mail service to send the credentials
        console.log('sending')
        res.send({
          error: false,
          msg: 'Indent Creation is success',
          result,
          indent_particular_data,
        })
      }
  } catch (e) {
    throw e
  }
}
