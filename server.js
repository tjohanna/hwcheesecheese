require("dotenv").config()
const { PORT = 3000, DATABASE_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")

////////////////////////////////////
// DATABASE CONNECTION
/////////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

mongoose.connection
.on("open", ()=>{console.log("Connected to mongo")})
.on("close", ()=>{console.log("Disconnected from mongo")})
.on("error", (error)=>console.log(error))


/////////////////////////
// MODELS
/////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

/////////////////////////
// MIDDLEWARE
/////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


/////////////////////////
// ROUTES
/////////////////////////
app.get("/", (req, res) => {
    res.send("hello world")
})

// INDEX
app.get("/cheese", async (req, res)=>{
    try{
        res.json(await Cheese.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

// CREATE
app.post("/cheese", async (req, res) => {
    try{
        res.json(await Cheese.create(req.body))
    } catch(error){
        res.status(400).json(error)
    }
})

// UPDATE
app.put("/cheese/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

////// DELETE
app.delete("/cheese/:id", async (req, res) =>{
    try{
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch(error){
        res.status(400).json(error)
    }
})


app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
