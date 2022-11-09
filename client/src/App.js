import logo from './logo.svg';
import './App.css';
import './styles.css';
import SignIn from './RegPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RedPage from './Redirection'
import Layout from './Layout'
import Hikes from './Hikes';
import API from './API';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  /* --- STATES --- */                   
  const [hikes, setHikes] = useState([]);          

  const addUser = (email,password,role)=>{
      const user = {email,password,role}
      //API.addUser()
  }

  async function loadHikes() {
    try {
      //const hikeList = await API.getHikes();
      const hikeList = [
        {id: 1, title: "First Hike", length: "10km", description: "Lorem Ipsum...", difficulty: "Easy", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 2, title: "Second Hike", length: "10km", description: "Lorem Ipsum...", difficulty: "Average", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 3, title: "Third Hike", length: "10km", description: "Lorem Ipsum...", difficulty: "Difficult", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 4, title: "Fourth Hike", length: "10km", description: "Lorem Ipsum...", difficulty: "Average", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 5, title: "Fifth Hike", length: "10km", description: "Lorem Ipsum...", difficulty: "Easy", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 6, title: "Sixth Hike", length: "10km", description: "Lorem Ipsum...", difficulty: "Easy", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
      ]
      setHikes(hikeList);
      //setErrMessage('');
    } catch (err) {
      //setErrMessage(String(err));
    }
  };

  useEffect(() => {
    loadHikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


 
  return (

    <BrowserRouter>
      <Routes>

          <Route path='/' element={ <SignIn addUser={addUser}/>} />
          <Route path='/redirect/' element={ <RedPage />} />

          <Route element = {<Layout />}>
            <Route path='/hikes' element = {<Hikes hikes = {hikes}/>} />
          </Route>
          
          
        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
