import './App.css';
import {  useNavigate,useParams } from 'react-router-dom';
import {useState,useEffect} from 'react';
import {Container,Alert,Button} from 'react-bootstrap';

import API from './API';


function ValidatePage() {

    const navigate = useNavigate(); 
    const {code} = useParams(); 

    const [success, setSuccess] = useState(false); 
    const [show, setShow] = useState(true);

    const handleSubmit = ()=>{
        if(!success)
            navigate("/signIn");
        else 
            navigate("/login");
        
    }

    useEffect( 
        ()=>{
          const validateUser = async()=>{
            try{
                let stat = await API.validateUser(code);
                
                if(stat===true) 
                    setSuccess(stat); 
                else 
                    setSuccess(false); 
            
            }
            catch(err){}
          }; 
          validateUser(); 
        },[code]);  
    

    return (
        <Container className="shadow-sm p-2">
        {success ? <>
            <Alert variant="success">
                    <Alert.Heading>Utente create con successo</Alert.Heading>
                    <p>
                        Premi il buttone qui sotto, per andare nella pagina di login
                    </p>
            </Alert>
            <Button variant="primary" onClick={handleSubmit}>Login</Button>
            </>

        
        :   <>
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Mi dispiace, qualcosa è andato storto</Alert.Heading>
                    <p>
                        Premi il buttone qui sotto, per andare nella pagina di registrazione
                    </p>
            </Alert>
            <Button variant="primary" onClick={handleSubmit}>Registrati</Button>
            </>
            
        }

        </Container>
        
    ); 
}


export default ValidatePage;