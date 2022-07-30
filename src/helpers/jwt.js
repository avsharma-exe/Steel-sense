import jwt from 'jsonwebtoken';
import executeQuery from "../server/Connection"

const jwtConfig = {
  secret: 'dd5f3089-40c3-469n-af14-d0c228b05ad4'
}


function createJwt(user) {
    const accessToken = jwt.sign({
        user_id: user.User_ID,
        email: user.Email
    } , jwtConfig.secret , {expiresIn: 60 * 60 * 24})

    return accessToken
}


async function checkJwt(token) {
  const decoded = jwt.decode(token, { complete: true })
  const payload = decoded.payload

  const checkUser = await executeQuery("Select Email from User_Master where User_ID = ?" , [payload.user_id])

  if(checkUser && checkUser.length) {
      user = checkUser[0]
      if(user.Email === payload.email) {
          return true
      }
  }

  return false
}

export {checkJwt , createJwt}