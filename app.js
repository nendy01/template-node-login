import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()

import morgan from 'morgan'

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// db and authenticateUser
import connectDB from './db/connect.js'

// routers
import authRouter from './routes/auth.js'

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}else{
    app.use(morgan('tiny'))
}

// only when ready to deploy
// app.use(express.static(path.resolve(__dirname, './client/build')))

app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use('/api/auth', authRouter)

// only when ready to deploy
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
// })

app.all('*',(req,res) =>{
    res.status(404).json({msg:"pagina no encontrada"})
})

const port = process.env.PORT || 5000

const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    await connectDB(process.env.MONGO_URL)
  } catch (error) {
    console.log(error)
    
  }
}
start()