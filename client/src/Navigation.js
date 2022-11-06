import {Navbar, Container, Col, Nav, Form, Row, Button} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {useState} from 'react';


function Navigation(props) {

    let params = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    
    const loginHandler = (event) => {
        event.preventDefault();

        setUsername("");
        setPassword("");
        navigate('/serviceType');
    
    }

    return (
        <>

            {/* -- NAVBAR -- */}

            <Navbar bg="light" expand="lg">
                <Container fluid className="shadow-sm p-2" id="topbar">

                    <Col className="col-3">
                        {/* Logo and brand */}
                        <Container>
                        <Navbar.Brand>
                            <i id = "title" style = {{'marginLeft': '20px'}}>OQM</i>
                        </Navbar.Brand>
                        </Container>
                    </Col>

                    {/* Aria controls */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    {/* Dropdowns and links */}
                   <Container>
                    <Navbar.Collapse id="basic-navbar-nav" >
                        <Nav className="ms-auto">
                            {params.service == 'serviceType' ||
                            <Container>
                                <Form onSubmit={loginHandler}>
                                    <Row>
                                    <Col align = "center">
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Control  size = "sm" type="text" placeholder="Username" required = {true}
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}/>
                                    </Form.Group>
                                    </Col>
                                    <Col align = "center">
                                    <Form.Group  className="mb-3" controlId="password">
                                        <Form.Control  size = "sm" type="password" placeholder="Password" required = {true}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}/>
                                    </Form.Group>
                                    </Col>
                                    <Col xs = {2} align = "center">
                                    <Button  variant="primary" size="sm" type="submit">
                                            Login
                                    </Button>
                                    </Col>
                                    </Row>
                                </Form>
                        </Container>
                        }
                        </Nav>
                    </Navbar.Collapse>
                    </Container> 
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;