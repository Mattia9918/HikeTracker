import './App.css';

import {Col,Form,Button,Toast,Row,Container} from 'react-bootstrap';
import { BsFillEnvelopeFill,BsLockFill,BsPersonCircle,BsBoxArrowInRight } from "react-icons/bs";
import {useState} from 'react';

function LoginForm(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [show,setShow] = useState(false); 

    const signInHandler = (event) => {
        event.preventDefault();
        if(password===""){
          setError("Password vuota"); 
          setShow(true); 
        }
        else{
          const username = email; 
          const credentials = {username,password}
          props.login(credentials);            
        }
   
    
    }

  return (<>
    {error!=="" ? <>
        <Toast className="w-100 mb-3" onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header closeButton={false}>{error}</Toast.Header>
        </Toast>
    </>
    :false}

    <Container className="shadow-sm p-2 mt-5">
      <center className="mb-3 fs-2"><BsPersonCircle/>{' '}</center>
    <Form onSubmit={signInHandler}>
    
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="3">
          <BsFillEnvelopeFill /> Email
        </Form.Label>
        <Col sm="8">
          <Form.Control type="email" placeholder='email@example.com' 
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="3">
          <BsLockFill /> Password
        </Form.Label>
        <Col sm="8">
          <Form.Control type="password" placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          />
        </Col>
      </Form.Group>

      
      <center>
        <Button variant="success" size="lg" type="submit">
          <BsBoxArrowInRight/>  Login
        </Button>
      </center>
        
    </Form>
    </Container>
    </>
  );
}





export default LoginForm;
