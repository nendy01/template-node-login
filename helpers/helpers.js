import { validationResult } from 'express-validator';
import User from '../models/auth.js'

const emailExist = async (email) =>{
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
      return Promise.reject('este email ya esta registrado')
    }
}

const emailRegisted = async (email) =>{
    const existeEmail = await User.findOne({ email });

    if (!existeEmail) {
      return Promise.reject('')
    }
}


const validationCamps = (req,res,next) =>{
    const err = validationResult(req)
  if (!err.isEmpty()) {
     return res.status(404).json(err.array())
  }
  next()
}

export {emailExist,validationCamps,emailRegisted}

