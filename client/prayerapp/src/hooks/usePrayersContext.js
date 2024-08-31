import { PrayersContext } from "../context/PrayersContext"; 
import { useContext } from "react";

export const usePrayersContext = () => {
    const context = useContext(PrayersContext)

    if(!context){
        throw Error("usePrayersContext must be used inside PrayersContextProvider")
    }

    return context
}