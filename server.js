import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import Dbconnection from './config/db.js';
import userAuthRoute from './routes/userAuthRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

// yaha .env root me hai so we dont have to define path-
dotenv.config();
// databse config-
Dbconnection()
const app=express();

// -------------------------------middleware------------
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// -----------------------------routes------------------
app.use('/api/auth',userAuthRoute)
app.use('/api/category',categoryRoutes)
app.use('/api/product',productRoutes)
app.use('/api/chat',chatRoutes)

// rest modules-
app.get('/',(req,res)=>{
   res.send("<h1>Welcome to shareSpace</h1>")
})


// port-agar ush port pe nahi chala to bydefault 8080 pe chalega-
const port=process.env.PORT || 8080;

app.listen(port,()=>{
    console.log(`server running on ${port}`.bgMagenta.white)
});
