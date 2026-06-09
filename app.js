import express from  "express"
import dotenv from "dotenv"
import authRoutes from "./routes/user/authRoutes.js"

dotenv.config()

let app = express()

app.use(express.static("public"))
app.use(express.json())

app.set("view engine","ejs")

app.use('/auth',authRoutes)

app.listen(process.env.PORT,()=>{
  console.log(`SERVER STARTING PORT NUMBER ${process.env.PORT} ...`)
})