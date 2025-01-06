import { useState } from "react"
import { usePrayersContext } from "../hooks/usePrayersContext"
const PrayerCard = ({prayerData}) => {
        const {dispatch} = usePrayersContext()
        const [fajr, setFajr] = useState(prayerData.fajr_checked)
        const [dhuhr, setDhuhr] = useState(prayerData.dhuhr_checked)
        const [asr, setAsr] = useState(prayerData.asr_checked)
        const [maghrib, setMaghrib] = useState(prayerData.maghrib_checked)
        const [isha, setIsha] = useState(prayerData.isha_checked)

        const updatePrayers = async (updatedData) => {
                const response = await fetch('/api/prayers/'+prayerData.id, {
                        method: 'PATCH',
                        body: JSON.stringify(updatedData),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                })

                const json = await response.json()

                if(response.ok){
                        dispatch({type: 'UPDATE_PRAYER', payload:json})
                }
        }
        const handleCheckboxChange = async (prayer, setFunc, event) => {
                const newCheckedValue = event.target.checked ? 1 : 0; 
                setFunc(newCheckedValue);

                const updatedData = {
                        fajr_checked: prayerData.fajr_checked,
                        dhuhr_checked: prayerData.dhuhr_checked,
                        asr_checked: prayerData.asr_checked,
                        maghrib_checked: prayerData.maghrib_checked,
                        isha_checked: prayerData.isha_checked,
                        [`${prayer}_checked`]: newCheckedValue
                };

                console.log(updatedData)
                
                await updatePrayers(updatedData);
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
                                        <input type="checkbox" checked={fajr === 1} onChange={(event) => handleCheckboxChange("fajr", setFajr, event)}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Dhuhr'>
                                <strong>Dhuhr:</strong> {prayerData.dhuhr_timing}
                                <label className="container">
                                        <input type="checkbox" checked={dhuhr === 1} onChange={(event) => handleCheckboxChange("dhuhr", setDhuhr, event)}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Asr'>
                                <strong>Asr:</strong> {prayerData.asr_timing}
                                <label className="container">
                                        <input type="checkbox" checked={asr === 1} onChange={(event) => handleCheckboxChange("asr", setAsr, event)}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Maghrib'>
                                <strong>Maghrib:</strong> {prayerData.maghrib_timing}
                                <label className="container">
                                        <input type="checkbox" checked={maghrib === 1} onChange={(event) => handleCheckboxChange("maghrib", setMaghrib, event)}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        <li key='Isha'>
                                <strong>Isha:</strong> {prayerData.isha_timing}
                                <label className="container">
                                        <input type="checkbox" checked={isha === 1} onChange={(event) => handleCheckboxChange("isha", setIsha, event)}/>
                                        <span className="checkmark"></span>
                                </label>
                        </li>
                        </div>
                </div>
        )
}

export default PrayerCard