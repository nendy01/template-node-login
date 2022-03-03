import User from '../models/auth.js'
import { StatusCodes } from 'http-status-codes'

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const user = await User.create({ name, email, password })

    const token = user.createJWT()

    res.status(StatusCodes.CREATED)
    .json({token:`Bearer ${token}`,user: {name: user.name,email: user.email,}})
  } catch (error) {
    console.log(error);
  }
}



const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email }).select('+password')

    if (!user) return res.status(404).json('no hay usuario registrado con este email')
    
    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect)  return res.json("email or password invalid")
    
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({token:`Bearer ${token}`,user:{name:user.name,email:user.email}})
  } catch (error) {
    console.log(error);
  }
}


const updateUser = async (req, res) => {
  try {
  const {lastpassword,...restUser} = req.body
  const id = req.user.userId

  const user = await User.findById(id).select('+password')

  const isPasswordCorrect = await user.comparePassword(lastpassword)

  if (!isPasswordCorrect) return res.status(StatusCodes.NOT_ACCEPTABLE).json('esta password es incorrecta')
  
  const updated = await User.findByIdAndUpdate(id,restUser,{ new: true })
  const token = updated.createJWT()
  
  res.status(StatusCodes.OK).json({token,user:{name:updated.name,email:updated.email}})
  } catch (error) {
    console.log(error);
  }
}



export { register, login, updateUser }