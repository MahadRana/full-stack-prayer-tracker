const mongoose = require('mongoose')

const Schema = mongoose.Schema

const prayerSchema = new Schema({
    gregorian_date: {
        type: String,
        required: true,
        unique:true
      },
    hijri_date: {
        type: String,
        required: true, 
        unique:true
    },
    fajr_checked: {
        type:Boolean,
        required: true
    }, fajr_timing: {
        type:String,
        required:true
    },
     dhuhr_checked: {
        type:Boolean,
        required: true
    }, dhuhr_timing: {
        type:String,
        required:true
    },
    asr_checked: {
        type:Boolean,
        required: true
    }, asr_timing: {
        type:String,
        required:true
    },
    maghrib_checked: {
        type:Boolean,
        required: true
    }, maghrib_timing: {
        type:String,
        required:true
    },
    isha_checked: {
        type:Boolean,
        required: true
    }, isha_timing: {
        type:String,
        required:true
    }
}, {timestamps: true})

module.exports = mongoose.model('Prayer', prayerSchema)

