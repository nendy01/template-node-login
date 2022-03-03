import express from 'express'
const router = express.Router()
import {body} from 'express-validator'

import rateLimiter from 'express-rate-limit'
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
})

import { register, login, updateUser } from '../controllers/auth.js'
import autentication from '../middlewares/autentication.js'
import { emailExist,emailRegisted,validationCamps } from '../helpers/helpers.js'

router.post('/register',[
    apiLimiter,
    body('name').bail()
    .exists().withMessage('el nombre es obligatorio')
    .isLength({min:3})
    .withMessage('el nombre debe tener un minimo de 3 letras'),
    body('email').bail()
    .isEmail().withMessage('esto no es un email valido')
    .custom(emailExist),
    body('password').bail()
    .exists().withMessage('password obligatoria')
    .isLength({min:7}).withMessage('la password debe tener un minimo de 7 caracteres'),
    validationCamps
  ]
  , register)

  
router.post('/login',[
  apiLimiter,
  body('email').bail()
  .isEmail().withMessage('esto no es un email valido')
  .custom(emailRegisted),
  body('password').bail()
  .exists().withMessage('password obligatoria')
  .isLength({min:7}).withMessage('la password debe tener un minimo de 7 caracteres'),
  validationCamps
] ,login)


router.patch('/update',[
  autentication,
   body('lastpassword').bail()
  .exists().withMessage('la contrase;a anterior es obligatoria')
  .isLength({min:7}).withMessage('el lastpassword debe tener minimo 7 caractes'),
  validationCamps 
], updateUser)

export default router









