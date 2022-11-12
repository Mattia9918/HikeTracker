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

function App(){
  return (
    <BrowserRouter>
      <App2/>
    </BrowserRouter>
  );
}
function App2() {

  /* --- STATES --- */                   

  const [hikes, setHikes] = useState([]);    
  const [status,setStatus] = useState("undefined");
  const [msg, setMsg] = useState("");
  const [loggedIn, setLoggedIn] = useState(false); 
  const [user, setUser] = useState(undefined);
  
  const navigate = useNavigate(); 
 
  //check Utente loggato: 
   useEffect(()=> {
    const checkAuth = async() => {
      try {
        const utente = await API.getUserInfo();
        setMsg({message:"",type:""});
        setLoggedIn(true);
        setUser(utente);

      } catch(err) {}
    };
    checkAuth();
  }, []);
  
  const addUser = async (email,password,role, name, surname,username)=>{
      
      const user = {email,password,role, name, surname,username}
      try {
        await API.addUser(user); 
        setStatus("success"); 
        setMsg({message: 'Check email to activate your account', type: "success"}); 

      }
      catch(error){
        setStatus("error");
        
        if(error.message.includes("SQLITE_CONSTRAINT"))
          setMsg({message: 'User previously defined', type: "danger"}); 
        else if(error.message.includes("Invalid value"))
          setMsg({message: 'Error with format of data', type: "danger"}); 
        else  
          setMsg({message: 'Sorry, something went wrong', type: "danger"}); 
       
          
      }
  }

  const login = async (credentials) => {
  
    try {
      const user = await API.logIn(credentials);
      if(user.message !== undefined)
      {
        setMsg({message: user.message, type: "danger"}); 
      } else {
        setUser(user);
        setLoggedIn(true);
        navigate(`/`);
        setMsg({message: `Welcome ${user.username}!`, type: "success"})
      }
    }
    catch (err) { 
      setMsg({message: err.message, type: "danger"}); 
    }
  }
  
  const logout = async () => {
      await API.logOut()
      setUser(undefined);
      setLoggedIn(false);
      setMsg({message: "You have been logged out!", type: "warning"})
      navigate("/"); 
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

  async function loadFilter(filter, value) {
    try {
      const filteredHikeList = await API.getFilter(filter, value);
      setHikes(filteredHikeList);
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
      <Routes>
      
          <Route element = {<Layout user = {user} logout = {logout}/>}>
            <Route path='/' element = {<Hikes hikes = {hikes} loadFilter = {loadFilter} msg = {msg} user = {user} />}/>
            <Route path='/validate/:code' element={ <ValidatePage />} />
            <Route path='/register' element={ <SignIn addUser={addUser} status={status} msg={msg}/>} /> 
            <Route path='/login' element={ <LoginForm login={login} msg={msg} setMsg={setMsg}/>}/>
          </Route>
          
          
      </Routes>
   
  );
}

export default App;
