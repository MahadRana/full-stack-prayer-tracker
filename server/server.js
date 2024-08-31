require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const PrayerRoutes = require('./routes/prayer')

const app = express()

app.use(express.json())


app.use('/api/prayers',PrayerRoutes)

mongoose.connect(process.env.MONG_URI)
    .then(() => {
        //listen for requests 
        app.listen(process.env.PORT, () => {
            console.log('listening on port 4000!')
        })
    })
    .catch((error)=>{
        console.log(error)
    })