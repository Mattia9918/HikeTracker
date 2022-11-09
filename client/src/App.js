import logo from './logo.svg';
import './App.css';
import SignIn from './RegPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RedPage from './Redirection'

import API from './API';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const addUser = (email,password,role)=>{
      const user = {email,password,role}
      //API.addUser()
  }
 
  return (

    
  
    <BrowserRouter>
      <Routes>

          <Route path='/' element={ <SignIn addUser={addUser}/>} />
          <Route path='/redirect/' element={ <RedPage />} />
          
        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
