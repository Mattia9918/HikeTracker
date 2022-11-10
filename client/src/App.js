import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';
import RedPage from './Redirection'
import Layout from './Layout'
import Hikes from './Hikes';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import ValidatePage from './ValidateUser'
import SignIn from './RegPage'
import LoginForm from './Login'
import API from './API';


function App() {

  /* --- STATES --- */                   
  const [hikes, setHikes] = useState([]);          
  const [status,setStatus] = useState(false);
 
 
  const addUser = async (email,password,role, name, surname)=>{
      
      const user = {email,password,role, name, surname}
      
      const stat = await API.addUser(user); 

      if (stat===true) 
        setStatus(true); 
  }

  const login = (email,password,role)=>{

      //navigate("/"); 
  }

  async function loadHikes() {
    try {
      //const hikeList = await API.getHikes();
      const hikeList = [
        {id: 1, title: "First Hike", length: "10km", description: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", difficulty: "Easy", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 2, title: "Second Hike", length: "10km", description: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim venia.", difficulty: "Average", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 3, title: "Third Hike", length: "10km", description: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", difficulty: "Difficult", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 4, title: "Fourth Hike", length: "10km", description: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim venia", difficulty: "Average", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 5, title: "Fifth Hike", length: "10km", description: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", difficulty: "Easy", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
        {id: 6, title: "Sixth Hike", length: "10km", description: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", difficulty: "Easy", ascent: "50%", estimatedTime: "2h", localguideID: "1"},
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
      
          <Route path='/' element={ <SignIn addUser={addUser} status={status}/>} />
          <Route path='/redirect/' element={ <RedPage />} />

          <Route element = {<Layout />}>
            <Route path='/hikes' element = {<Hikes hikes = {hikes}/>} />
          </Route>
       
          <Route path='/validate/:code' element={ <ValidatePage />} />
          <Route path='/login' element={ <LoginForm login={login}/>}/>
          
        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
