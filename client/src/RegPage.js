import {Col,Form,Button,Row,Container} from 'react-bootstrap';
import './App.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useState} from 'react';

function SignIn(props) {


    const [email, setEmail] = useState("p@gmail.com"); 
    const [password, setPassword] = useState("test");
    const [role, setRole] = useState("");

    const loginHandler = (event) => {
        event.preventDefault();
        
        props.addUser(email,password,role);
        setEmail("");
        setPassword("");
        setRole(""); 
        //navigate('/serviceType');
    
    }

  return (
    <Container className="shadow-sm p-2">
    <Form onSubmit={loginHandler}>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="3">
          Email
        </Form.Label>
        <Col sm="5">
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
        <Col sm="5">
          <Form.Control type="password" placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
      <Col sm="8">
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
            <Col> <Button variant="primary" type="submit">Registrati</Button>{' '}</Col>
        </Row>
    </Form>
    </Container>
  );
}





export default SignIn;