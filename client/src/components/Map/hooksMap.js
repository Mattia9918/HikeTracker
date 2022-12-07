import { useEffect, useState } from 'react';
import APIGpx from '../../API/APIGpx';
//get start and arrive coordinates with hikeId (start & arrive = hut,lots,trackPoint)
const useCoordinatesPoint = (hikeid)=>{

    const [start,setStart] = useState([]); 
    const [arrive,setArrive] = useState([]); 
    
    useEffect(()=>{
      const getCoordinates = async()=>{
            const point = await APIGpx.getPointByHikeId(hikeid); 
            setStart([point[0].latitude,point[0].longitude]); 
            setArrive([point[1].latitude,point[1].longitude]);
      }
      getCoordinates(); 
    },[hikeid])
  
  
    return {start,arrive}
}





export {useCoordinatesPoint}; 