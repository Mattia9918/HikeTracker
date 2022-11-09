import './App.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {useState} from 'react';
import {Container,Alert,Button} from 'react-bootstrap';


function RedPage(props) {

    const navigate = useNavigate(); 
    const [success, setSuccess] = useState(false); 
   
    const handleSubmit = ()=>{
        if(!success)
            navigate("/"); 
        
    }

    return (
        <Container className="shadow-sm p-2">
        {success ? <>
            <Alert variant="success">
                    <Alert.Heading>Utente create con successo</Alert.Heading>
                    <p>
                        Premi il buttone qui sotto, per andare nella pagina di login
                    </p>
            </Alert>
            <Button variant="primary">Login</Button>{' '}
            </>

        
        :   <>
            <Alert variant="danger">
                    <Alert.Heading>Mi dispiace, qualcosa è andato storto</Alert.Heading>
                    <p>
                        Premi il buttone qui sotto, per andare nella pagina di registrazione
                    </p>
            </Alert>
            <Button variant="primary" onClick={handleSubmit}>Registrati</Button>{' '}
            </>
            
        }

        </Container>
        
    ); 
}


export default RedPage;