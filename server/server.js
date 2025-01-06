require('dotenv').config()
const express = require('express')

const PrayerRoutes = require('./routes/prayer')

const app = express()

app.use(express.json())


app.use('/api/prayers',PrayerRoutes)

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('listening on port 4000!')
})