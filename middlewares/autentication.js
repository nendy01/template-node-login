import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'



const autentication = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({msg:'token es requerido'})
  }
  const token = authHeader.split(' ')[1]
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId }

    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({msg:'token no valido'})
  }
}

export default autentication