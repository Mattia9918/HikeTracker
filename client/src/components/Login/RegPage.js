import { Col, Form, Button, Row, Alert, Container } from 'react-bootstrap';
import '../../css/App.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';



function SignIn(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  //const [role, setRole] = useState("");


  const [show, setShow] = useState(true);

  const resetState = () => {
    setEmail("");
    setPassword("");
    //setRole("");
    setName("");
    setSurname("");
    setUsername("");
  }
  useEffect(() =>{
    props.setStatus("");
  },[]); 
  const signInHandler = (event) => {

    event.preventDefault();

    props.addUser(email, password, "hiker", name, surname, username);

    resetState();

    //navigate('/serviceType');

  }

  return (<>

    <Container className="shadow-sm p-5 mt-5 w-75" id = "cardscontainer">
      {props.status === "success" ?
        <Alert variant={props.msg.type} className="w-100 " onClose={() => setShow(false)} show={show} dismissible>
          {props.msg.message}
        </Alert> : false}
      {props.status === "error" ?
        <Alert variant={props.msg.type} className="w-100 " onClose={() => setShow(false)} show={show} dismissible>
          {props.msg.message}
        </Alert> : false}
      <Form onSubmit={signInHandler}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
          <Form.Label column sm="3">
            Username
          </Form.Label>
          <Col sm="8">
            <Form.Control required={true} type="text" placeholder='username'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="3">
            Nome
          </Form.Label>
          <Col sm="8">
            <Form.Control required={true} type="text" placeholder='nome'
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
            <Form.Control required={true} type="text" placeholder='cognome'
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
            <Form.Control required={true} type="email" placeholder='email@example.com'
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
            <Form.Control type="password" placeholder="********"
              required={true}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Col>
        </Form.Group>

        {/*<Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col sm="11">
            <Form.Select aria-label="Default select example"
              required={true}
              onChange={(event) => setRole(event.target.value)}
            >
              <option >Select Role</option>
              <option value={"hiker"}  >Hiker</option>
              <option value={"localGuide"}  >Local Guide</option>
              <option value={"hutWorker"} >Hut Worker</option>
              <option value={"platformManager"} >Platform Manager</option>
            </Form.Select>
          </Col>
        </Form.Group>*/}

        <center><Button variant="primary" size="lg" type="submit">Register</Button></center>

      </Form>
    </Container></>
  );
}





export default SignIn;
