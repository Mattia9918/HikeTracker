import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import './css/styles.css';
import { useState, useEffect } from 'react';
import Layout from './components/Layout'
import Hikes from './components/Hikes';
import { BrowserRouter, Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import ValidatePage from './components/Login/ValidateUser'
import SignIn from './components/Login/RegPage'
import LoginForm from './components/Login/Login'
import HikeForm from './components/HikeForm/hikeForm';
import Hut from './components/HutForm/Hut';
import APILogin from './API/APILogin';
import APIHikeForm from './API/APIHikeForm';
import APIpostGpx from './API/APIpostGpx';
import APIHikes from './API/APIHikes';
import APIHutForm from './API/APIHutForm';

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
  const [posting, setPosting] = useState();
  

  const navigate = useNavigate(); 
 
  //check Utente loggato: 
   useEffect(()=> {
    const checkAuth = async() => {
      try {
        const utente = await APILogin.getUserInfo();
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
        await APILogin.addUser(user); 
        setStatus("success"); 
        setMsg({message: 'Check email to activate your account', type: "success"}); 

      }
      catch(error){
        setStatus("error");
       
        if(error.message.includes("Email already registered!") || error.message.includes("Username already used!"))
          setMsg({message: 'User previously defined', type: "danger"}); 
        else if(error.message.includes("Invalid value"))
          setMsg({message: 'Error with format of data', type: "danger"}); 
        else  
          setMsg({message: 'Sorry, something went wrong', type: "danger"}); 
       
          
      }
  }

  async function postHike(Hike, filePath) {
      await APIHikeForm.postHike(Hike);
      await APIpostGpx.postGpx(filePath);
      setPosting(true);
  }

  async function postHut(hut) {
    await APIHutForm.postHut(hut); 

  }

  const login = async (credentials) => {
  
    try {
      const user = await APILogin.logIn(credentials);
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
      await APILogin.logOut()
      setUser(undefined);
      setLoggedIn(false);
      setMsg({message: "You have been logged out!", type: "warning"})
      navigate("/"); 
    }

  async function loadHikes() {
    try {
      const hikeList = await APIHikes.getHikes();
      setHikes(hikeList);
      setPosting(false);
      //setErrMessage('');
    } catch (err) {
      //setErrMessage(String(err));
    }
  };

  async function loadFilter(filter, value) {
    try {
      const filteredHikeList = await APIHikes.getFilter(filter, value);
      setHikes(filteredHikeList);
      //setErrMessage('');
    } catch (err) {
      //setErrMessage(String(err));
    }
  };

  useEffect(() => {
    loadHikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posting]);


 
  return (
      <Routes>
      
          <Route element = {<Layout user = {user} logout = {logout}/>}>
            <Route path='/' element = {<Hikes hikes = {hikes} loadFilter = {loadFilter} msg = {msg} user = {user} setMsg = {setMsg} />}/>
            <Route path='/validate/:code' element={ <ValidatePage />} />
            <Route path='/register' element={(!user && <SignIn addUser={addUser} status={status} setStatus={setStatus} msg={msg}/>) || <Navigate replace to='/' />} /> 
            <Route path='/login' element={(!user && <LoginForm login={login} msg={msg} setMsg={setMsg}/>) || <Navigate replace to='/' />}/>
            <Route path='/newhike' element={((user && user.role === 'localGuide') && <HikeForm postHike={postHike} user = {user}/>) || <Navigate replace to='/' />}/>
            <Route path='/newHut' element={<Hut postHut={postHut}></Hut>}/>
          </Route>
          
          
      </Routes>
   
  );
}

export default App;
