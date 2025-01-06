import {useEffect } from 'react'
import PrayerCard from '../Components/PrayerCard'
import { usePrayersContext } from '../hooks/usePrayersContext';

const Home = () => {
    const {prayers, dispatch} = usePrayersContext()

    useEffect(() => {
        const fetchPrayers = async () => {
            const response = await fetch('/api/prayers', {method:'GET'})
            const json = await response.json()
            if(response.ok){
                dispatch({type:'SET_PRAYERS', payload:json})
            }
        }
        fetchPrayers()
    }, [dispatch])

    useEffect(()=>{
        const convertToDateObject = (dateString) => {
            // Split the string by '-' to get day, month, and year separately
            const [day, month, year] = dateString.split('-');
            return new Date(Number(year), Number(month)-1, Number(day));
            // Return a new Date object with 'YYYY-MM-DD' format
            
        };

        const deleteOldestPrayer = async (oldestPrayerId) => {
            const response = await fetch(`/api/prayers/${oldestPrayerId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                dispatch({ type: 'DELETE_PRAYER', payload: { id: oldestPrayerId } });
            }
        }
        // Function to check and delete the oldest prayer if there are more than 12 prayers
        const checkAndDeleteOldestPrayer = async () => {
            if (prayers && prayers.length > 0) {
                //find number of days between right now and the oldest prayerdate in the collection
                const currentDate = new Date();
                const oldestPrayer = prayers.reduce((oldest, current) => 
                    new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current
                );
                const oldestPrayerDate = convertToDateObject(oldestPrayer.gregorian_date);
                const numDays = Math.floor((currentDate - oldestPrayerDate) / (1000 * 60 * 60 * 24));
                //if the number of days is greater than 12 then we can get rid of the oldest values 
                if (numDays > 12){
                    for(let i = 0; i < numDays-12; i++){
                        const oldestPrayer = prayers.reduce((oldest, current) => 
                            new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current
                        );
                        await deleteOldestPrayer(oldestPrayer.id);
                    }
                }
            }
        }
        const postPrayers = async (date) => {
            const response = await fetch('/api/prayers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({date}), 
            });
            const json = await response.json()
            if(response.ok){
                dispatch({type: 'CREATE_PRAYER', payload: json})
            }
            if(!response.ok){
                console.log(json.error)
            }
        }

        const postDaily = async () => {
            if (!prayers){
                return;
            }
            const date = new Date();
            const formattedDate = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            };
            let day = `${formattedDate.day}`.padStart(2, '0');
            let month = `${formattedDate.month}`.padStart(2, '0');

            const formattedToday = `${day}-${month}-${formattedDate.year}`;
            // Check if today's prayer already exists in `prayers`
            const existingPrayer = prayers?.find(prayer => prayer.gregorian_date === formattedToday);
            if (existingPrayer) {
                return; // Prevent duplicate posting
            }
            await checkAndDeleteOldestPrayer();
            await postPrayers(formattedDate);
        };

        const handleMissingDays = async () => {
            if (!prayers || prayers.length === 0) {
                return;
            } 
            // Convert the latest prayer date to a JavaScript Date object
            const latestPrayerDate = convertToDateObject(prayers[0].gregorian_date);
            const currentDate = new Date();
            // Calculate the number of missing days
            const missingDays = Math.floor((currentDate - latestPrayerDate) / (1000 * 60 * 60 * 24));
            // Loop through each missing day and post prayers
            if (missingDays <= 0) return; // Avoid unnecessary posting if no days are missing
            for (let i = 1; i <= missingDays; i++) {
                if (prayers.length > 12){
                    await checkAndDeleteOldestPrayer();
                }
                const missingDate = new Date(latestPrayerDate);
                missingDate.setDate(latestPrayerDate.getDate() + i);
                
                const formattedDate = {
                    day: missingDate.getDate(),
                    month: missingDate.getMonth() + 1, // Months are 0-indexed in JavaScript
                    year: missingDate.getFullYear(),
                };
                await postPrayers(formattedDate);
            }
        };
        postDaily();
        handleMissingDays();
        const now = new Date();
        const midnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0, 0, 0, 0
        );

        let interval;
        const msUntilMidnight = midnight - now;
    
        const timeout = setTimeout(() => {
            postDaily();
          interval = setInterval(postDaily, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    
        return () => {
          clearTimeout(timeout);
          if (interval) {
            clearInterval(interval);
          }
        };
    },[dispatch, prayers])


    return (
        <div className="Home">
            {prayers && prayers.map((prayer) => (
                <PrayerCard key={prayer.id} prayerData={prayer}/>
            ))}
        </div>
    )
}

export default Home;