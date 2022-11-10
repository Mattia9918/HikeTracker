import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import {useState} from 'react';

import ValidatePage from './ValidateUser'
import SignIn from './RegPage'
import LoginForm from './Login'

import API from './API';


function App() {

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
 
  return (

    
  
    <BrowserRouter>
      <Routes>

          <Route path='/' element={ <SignIn addUser={addUser} status={status}/>} />
          <Route path='/validate/:code' element={ <ValidatePage />} />
          <Route path='/login' element={ <LoginForm login={login}/>}/>
          
        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
