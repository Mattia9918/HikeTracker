import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css';
import API from './API';
import HikeForm from './components/hikeForm';



// const getInfoStart = async  (info) =>  {
//   console.log("infoooooo"); 
  

//   const a =  await API.getInfo(info); 
//   console.log(a); 
//   setStartpoint(a); 
   
//   return a;  
  
// }
// const getInfoEnd = async  (info) =>  {
//   console.log("infoooooo"); 
//   console.log(info);

//   const a =  await API.getInfo(info);
//   setEndpoint(a); 
  
//   return a;  
  
// }

 

async function loadHike(Hike) {
  console.log(Hike);
  await API.postHike(Hike); 
}




const App = () => (
  
  
  
  <div className='container mt-4'>

      <HikeForm loadHike={loadHike} ></HikeForm>
  </div>
);

export default App;
