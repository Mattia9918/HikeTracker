import {Col,Form,Button,Alert,Row,Container} from 'react-bootstrap';
import './App.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useState} from 'react';

function SignIn(props) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("prova");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [role, setRole] = useState("");

    const signInHandler = (event) => {
        event.preventDefault();
        if(password==="")
          console.log("password vuoto")
        else{
          props.addUser(email,password,role,name,surname);
        setEmail("");
        setPassword("");
        setRole(""); }
        //navigate('/serviceType');
    
    }

  return (

    <Container className="shadow-sm p-2">
    {props.status ? <>
      <Alert variant="success" dismissibile>
                    <Alert.Heading>Ti abbiamo inviato un email per attivare il tuo account</Alert.Heading>
            
            </Alert>

    </>:false}
    <Form onSubmit={signInHandler}>
    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="3">
          Nome
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder='email@example.com' 
          value={name}
          onChange={(event) => setName(event.target.value)}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="3">
          Cognome
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder='email@example.com' 
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
          />
        </Col>
      </Form.Group>

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
            <Col> 
              <Button variant="primary" type="submit">Registrati</Button>
            </Col>
        </Row>
    </Form>
    </Container>
  );
}





export default SignIn;