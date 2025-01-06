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
            
            // Return a new Date object with 'YYYY-MM-DD' format
            return `${year}-${month}-${day}`;
        };

        const deleteOldestPrayer = async (oldestPrayerId) => {
            const response = await fetch(`/api/prayers/${oldestPrayerId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                dispatch({ type: 'DELETE_PRAYER', payload: { _id: oldestPrayerId } });
            }
        }
        // Function to check and delete the oldest prayer if there are more than 14 prayers
        const checkAndDeleteOldestPrayer = async () => {
            if (prayers) {
                // Sort prayers by date to find the oldest prayer
                while(prayers.length>14){
                    const oldestPrayer = prayers.reduce((oldest, current) => 
                        new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current
                    );
                    await deleteOldestPrayer(oldestPrayer._id);
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
                checkAndDeleteOldestPrayer()
            }
            if(!response.ok){
                console.log(json.error)
            }
        }

        const postDaily = async () => {
            const date = new Date();
            const formattedDate = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            };

            const formattedToday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
            // Check if today's prayer already exists in `prayers`
            const existingPrayer = prayers?.find(prayer => prayer.gregorian_date === formattedToday);
        
            if (existingPrayer) {
                console.log('Prayer for today already exists:', formattedToday);
                return; // Prevent duplicate posting
            }
        
        
            await postPrayers(formattedDate);
        };

        const handleMissingDays = async () => {
            if (!prayers) {
                return; // No prayers to handle
            } else if (prayers.length === 0){
                const date = new Date();
                const formattedDate = {
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                };
                await postPrayers(formattedDate);
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
        handleMissingDays()
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
                <PrayerCard key={prayer._id} prayerData={prayer}/>
            ))}
        </div>
    )
}

export default Home;