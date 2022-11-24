//import '../App.css';
import '../../css/App.css'; 

import {Col,Form,Button,Alert,Row,Container} from 'react-bootstrap';
import { BsFillEnvelopeFill,BsLockFill,BsPersonCircle,BsBoxArrowInRight } from "react-icons/bs";
import {useState,useEffect} from 'react';

function LoginForm(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show,setShow] = useState(true); 

    const signInHandler = (event) => {
        event.preventDefault();
        

        const username = email; 
        const credentials = {username,password}
        props.login(credentials); 
          
    
    }

    useEffect(() =>{
      props.setMsg({message:"",type:""});
    },[]); 


  return (<>
    {(props.msg.message!=="" &&  props.msg.message!==undefined) ? 
      <center>
        <Alert variant={props.msg.type} className="w-100 " onClose={() => setShow(false)} show={show} dismissible>
            {props.msg.message}
        </Alert>
      </center>
      :false}


    <Container className="shadow-sm p-5 w-75 mt-5" id = "cardscontainer">
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