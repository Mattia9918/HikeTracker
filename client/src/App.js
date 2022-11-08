import logo from './logo.svg';
import './App.css';
import SignIn from './RegPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import API from './API';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const addUser = (email,password,role)=>{
      const user = {email,password,role}
      //console.log(user); 
      //API.addUser()
  }
 
  return (

    
  
    <BrowserRouter>
      <Routes>
        
          <Route path='/' element={ <SignIn addUser={addUser}/>} />
        
        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
