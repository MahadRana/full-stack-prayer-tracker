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
                const today = new Date();
                const cutoffDate = new Date();
                cutoffDate.setDate(today.getDate() - 11); // Including today makes 12
                
                // Filter prayers within the past 12 days
                const deletePrayers = prayers.filter(prayer => {
                    const prayerDate = convertToDateObject(prayer.gregorian_date); 
                    return prayerDate < cutoffDate;
                });
                //delete all old prayers
                for (let i=0; i<deletePrayers.length; i++){
                    deleteOldestPrayer(deletePrayers[i].id)
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
        const handleMissingDays = async () => {
            if (!prayers){
                return;
            } 
            const today = new Date();
            if (prayers.length === 0){
                for (let i=0; i<12; i++){
                    const postDate = new Date();
                    postDate.setDate(today.getDate() - i);
                    const formattedDate = {
                        day: postDate.getDate(),
                        month: postDate.getMonth() + 1,
                        year: postDate.getFullYear(),
                    };
                    await postPrayers(formattedDate);
                }
            } else {
                const latestPrayer = prayers.reduce((oldest, current) => 
                    new Date(oldest.createdAt) < new Date(current.createdAt) ? current : oldest
                );
                const latestPrayerDate = convertToDateObject(latestPrayer.gregorian_date)
                const currDate = new Date()
                const missingDays = Math.floor((currDate - latestPrayerDate) / (1000 * 60 * 60 * 24));
                if (missingDays <= 0) return;
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
            }
            dispatch({ type: 'SORT_PRAYER' });
        }

        const postDaily = async () => {
            await checkAndDeleteOldestPrayer();
            await handleMissingDays();
        }
        
        postDaily();
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