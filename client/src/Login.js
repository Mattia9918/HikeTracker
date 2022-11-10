import './App.css';

import {Col,Form,Button,Toast,Row,Container} from 'react-bootstrap';

import {useState} from 'react';

function LoginForm(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("prova");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [show,setShow] = useState(false); 

    const signInHandler = (event) => {
        event.preventDefault();
        if(password===""){
          setError("Password vuota"); 
          setShow(true); 
        }
        else{
          props.login(email,password,role);            
        }
   
    
    }

  return (<>
    {error!=="" ? <>
        <Toast className="w-100 mb-3" onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header closeButton={false}>{error}</Toast.Header>
        </Toast>
    </>
    :false}

    <Container className="shadow-sm p-2">
    <Form onSubmit={signInHandler}>
    
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="3">
          Email
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
          Password
        </Form.Label>
        <Col sm="8">
          <Form.Control type="password" placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
      <Col sm="11">
        <Form.Select  aria-label="Default select example" 
            onChange={(event) => setRole(event.target.value)}
        >
            <option>Seleziona il ruolo</option>
            <option value={"admin"}  >Admin</option>
            <option value={"localGuide"}  >Local Guide</option>
            <option value={"user"} >User</option>
        </Form.Select>
        </Col>
      </Form.Group>
        <Row>
            <Col> <Button variant="primary" type="submit">Login</Button>{' '}</Col>
        </Row>
    </Form>
    </Container>
    </>
  );
}





export default LoginForm;