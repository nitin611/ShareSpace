import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import Dbconnection from './config/db.js';
import userAuthRoute from './routes/userAuthRoute.js'
import cors from 'cors'

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

// rest modules-
app.get('/',(req,res)=>{
   res.send("<h1>Welcome to shareSpace</h1>")
})


// port-agar ush port pe nahi chala to bydefault 8080 pe chalega-
const port=process.env.PORT || 8080;

app.listen(port,()=>{
    console.log(`server running on ${port}`.bgMagenta.white)
});




