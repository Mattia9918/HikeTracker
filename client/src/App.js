import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css';
import API from './API';
import HikeForm from './components/hikeForm';


 

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
