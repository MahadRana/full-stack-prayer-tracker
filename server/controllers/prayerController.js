const pool = require('../database/database')

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
        throw error;
    }
}

const getPrayers = async (req,res) => {
    try{
        const [prayers] = await pool.query("SELECT * FROM prayer_track ORDER BY createdAt DESC")
        return res.status(200).json(prayers);
    } catch (error){
        return res.status(400).json({error:error.message})
    }
}

const postPrayers = async (req,res) => {
    try{
        const { date } = req.body;
        //get data from API using getPrayerData func
        const prayerData = await getPrayerData(date)
        if(!prayerData){
            throw Error("Data could not be fetched from API")
        }
        //insert into database
        const query = `
        INSERT INTO prayer_track (
            gregorian_date, hijri_date, fajr_timing, dhuhr_timing, 
            asr_timing, maghrib_timing, isha_timing
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            prayerData.date.gregorian.date,
            prayerData.date.hijri.date,
            prayerData.timings.Fajr,
            prayerData.timings.Dhuhr,
            prayerData.timings.Asr,
            prayerData.timings.Maghrib,
            prayerData.timings.Isha,
        ];

        const [result] = await pool.query(query,values)
        const id = result.insertId

        const [updated] = await pool.query("SELECT * FROM prayer_track WHERE id = ?", [id]);
        return res.status(200).json(updated[0]);
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}

const updatePrayer = async (req,res) => {
    const {id} = req.params
    try{
        //ensure prayer in database
        const [row] = await pool.query("SELECT * FROM prayer_track WHERE id=?", [id])
        if (row.length === 0) {
            return res.status(404).json({error: 'Invalid ID'})
        }
        // Extract fields from req.body
        const { fajr_checked, dhuhr_checked, asr_checked, maghrib_checked, isha_checked } = req.body;

        // Ensure all required fields are present
        if (
            fajr_checked === undefined ||
            dhuhr_checked === undefined ||
            asr_checked === undefined ||
            maghrib_checked === undefined ||
            isha_checked === undefined
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        //update query
        const query = `
        UPDATE prayer_track
        SET fajr_checked = ?, dhuhr_checked = ?, asr_checked = ?, 
            maghrib_checked = ?, isha_checked = ?
        WHERE id = ?`;
        const values = [fajr_checked, dhuhr_checked, asr_checked, maghrib_checked, isha_checked, id]
        await pool.query(query,values)
        //return prayer to frontend
        const [updated] = await pool.query("SELECT * FROM prayer_track WHERE id = ?", [id]);
        return res.status(200).json(updated[0]);
    } catch (error){
        return res.status(500).json({error:error.message})
    }
}

const deletePrayer = async(req,res) => {
    const {id} = req.params
    try{
        //ensure prayer in database
        const [row] = await pool.query("SELECT * FROM prayer_track WHERE id=?", [id])
        if (row.length === 0) {
            return res.status(404).json({error: 'Invalid ID'})
        }

        const query = "DELETE FROM prayer_track WHERE id = ?";
        await pool.query(query, [id]);
        return res.status(200).json(row[0])
    } catch (error){
        return res.status(500).json({error:error.message})
    }
}

module.exports = {
    updatePrayer, getPrayers, postPrayers, deletePrayer
}