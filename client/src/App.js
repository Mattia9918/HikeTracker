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
  console.log(hikes)      
  const [status,setStatus] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); 
  const [user, setUser] = useState({});
  
  const navigate = useNavigate(); 
 
  //check Utente loggato: 
   useEffect(()=> {
    const checkAuth = async() => {
      try {
        const utente = await API.getUserInfo();
        setLoggedIn(true);
        setUser(utente);

      } catch(err) {}
    };
    checkAuth();
  }, []);
  
  const addUser = async (email,password,role, name, surname)=>{
      
      const user = {email,password,role, name, surname}
      
      const stat = await API.addUser(user); 

      if (stat===true) 
        setStatus(true); 
  }

  const login = async (credentials) => {
  
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      navigate(`/user/${user.id}`);
    }
    catch (err) {
        console.log(err); 
    }
  }
  
  const logout = async () => {
      await API.logOut()
      setUser({});
      setLoggedIn(false);
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
      
          <Route element = {<Layout />}>
            <Route path='/' element = {<Hikes hikes = {hikes} loadFilter = {loadFilter}/>} />
            <Route path='/register' element={ <SignIn addUser={addUser} status={status}/>} /> 
            <Route path='/validate/:code' element={ <ValidatePage />} />
            <Route path='/login' element={ <LoginForm login={login}/>}/>
          </Route>
      </Routes>
   
  );
}

export default App;
