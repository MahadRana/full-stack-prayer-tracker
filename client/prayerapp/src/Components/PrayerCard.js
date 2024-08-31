import { useState } from "react"
import { usePrayersContext } from "../hooks/usePrayersContext"
const PrayerCard = ({prayerData}) => {
        const {dispatch} = usePrayersContext()
        const [fajr, setFajr] = useState(prayerData.fajr_checked)
        const [dhuhr, setDhuhr] = useState(prayerData.dhuhr_checked)
        const [asr, setAsr] = useState(prayerData.asr_checked)
        const [maghrib, setMaghrib] = useState(prayerData.maghrib_checked)
        const [isha, setIsha] = useState(prayerData.isha_checked)

        const updatePrayers = async () => {
                const response = await fetch('/api/prayers/'+prayerData._id, {
                        method: 'PATCH',
                        body: JSON.stringify(prayerData),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                })

                const json = await response.json()

                if(response.ok){
                        dispatch({type: 'UPDATE_PRAYER', payload:json})
                }
        }
        const isChecked = (prayer_checked) => {
                return prayer_checked ? "checked" : ""
        }

        const handleCheckboxChangeFajr = async (event) => {
                // Toggle the checked state
                setFajr(event.target.checked);
                prayerData.fajr_checked = !fajr;
                await updatePrayers()
        }

        const handleCheckboxChangeDhuhr = async (event) => {
                // Toggle the checked state
                setDhuhr(event.target.checked);
                prayerData.dhuhr_checked = !dhuhr;
                await updatePrayers()
        }
        const handleCheckboxChangeAsr = async (event) => {
                // Toggle the checked state
                setAsr(event.target.checked);
                prayerData.asr_checked = !asr;
                await updatePrayers()
        }
        const handleCheckboxChangeMaghrib = async (event) => {
                // Toggle the checked state
                setMaghrib(event.target.checked);
                prayerData.maghrib_checked = !maghrib;
                await updatePrayers()
        }
        const handleCheckboxChangeIsha = async(event) => {
                // Toggle the checked state
                setIsha(event.target.checked);
                prayerData.isha_checked = !isha;
                await updatePrayers()
        }

        return(
                <div className="card">
                        <div className="dates">
                        <span>{prayerData.gregorian_date + ' CE'}</span>
                        <span>{prayerData.hijri_date + ' AH'}</span>
                        </div>
                        <div className='timings'>
                        <li key='Fajr'>
                                <strong>Fajr:</strong> {prayerData.fajr_timing}
                                <label className="container">
                                        <input type="checkbox" checked={isChecked(fajr)} onChange={handleCheckboxChangeFajr}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Dhuhr'>
                                <strong>Dhuhr:</strong> {prayerData.dhuhr_timing}
                                <label className="container">
                                        <input type="checkbox" checked={isChecked(dhuhr)} onChange={handleCheckboxChangeDhuhr}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Asr'>
                                <strong>Asr:</strong> {prayerData.asr_timing}
                                <label className="container">
                                        <input type="checkbox" checked={isChecked(asr)} onChange={handleCheckboxChangeAsr}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Maghrib'>
                                <strong>Maghrib:</strong> {prayerData.maghrib_timing}
                                <label className="container">
                                        <input type="checkbox" checked={isChecked(maghrib)} onChange={handleCheckboxChangeMaghrib}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Isha'>
                                <strong>Isha:</strong> {prayerData.isha_timing}
                                <label className="container">
                                        <input type="checkbox" checked={isChecked(isha)} onChange={handleCheckboxChangeIsha}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        </div>
                </div>
        )
}

export default PrayerCard