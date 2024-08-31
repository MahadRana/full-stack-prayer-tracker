const Prayer = require('../models/prayerModel')
const mongoose = require('mongoose')

const getPrayerData = async (currentDate) =>{
    //30-08-2024
    formatDate = `${currentDate.day}-${currentDate.month}-${currentDate.year}`
    try {
        const data = await fetch(`https://api.aladhan.com/v1/timingsByCity/${formatDate}?city=New+York+City&country=United+States&method=8`)
        if(!data.ok){
            throw new Error("Could not connect to API")
        }
        let prayer_data = await data.json()
        return prayer_data.data;
    } catch (error){
        console.error("Could not fetch data: ", error)
        return null;
    }
}

const getPrayers = async (req,res) => {
    try{
        const prayers = await Prayer.find({}).sort({createdAt: -1})
        res.status(200).json(prayers)
    } catch (error){
        res.status(400).json({error:error.message})
    }
}

const postPrayers = async (req,res) => {
    try{
        const { date } = req.body;
        const prayerData = await getPrayerData(date)
        if(!prayerData){
            throw Error("Data could not be fetched from API")
        }

        let prayer = await Prayer.create({
            gregorian_date: prayerData.date.gregorian.date,
            hijri_date:prayerData.date.hijri.date,
            fajr_checked: false,
            fajr_timing: prayerData.timings.Fajr, 
            dhuhr_checked: false, 
            dhuhr_timing: prayerData.timings.Dhuhr, 
            asr_checked: false, 
            asr_timing: prayerData.timings.Asr, 
            maghrib_checked: false, 
            maghrib_timing: prayerData.timings.Maghrib, 
            isha_checked: false,
            isha_timing: prayerData.timings.Isha
        })
        res.status(200).json(prayer)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updatePrayer = async (req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Invalid ID'})
    }

    const prayer = await Prayer.findOneAndUpdate({_id:id}, 
        {...req.body}, {new:true}
    )
    if(!prayer){
        return res.status(404).json({error: 'Could not update prayers'})
    }

    res.status(200).json(prayer)
}

const deletePrayer = async(req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Invalid ID'})
    }

    const prayer = await Prayer.findOneAndDelete({_id:id})

    if(!prayer){
        return res.status(404).json({error:'No such prayer'})
    }
    return res.status(200).json(prayer)
}

module.exports = {
    updatePrayer, getPrayers, postPrayers, deletePrayer
}