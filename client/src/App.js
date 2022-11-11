import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';
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
      const hikeList = await API.getHikes();
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
      
          <Route element = {<Layout />}>
            <Route path='/' element = {<Hikes hikes = {hikes}/>} />
          </Route>

          <Route path='/register' element={ <SignIn addUser={addUser} status={status}/>} /> 
          <Route path='/validate/:code' element={ <ValidatePage />} />
          <Route path='/login' element={ <LoginForm login={login}/>}/>
          
        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
