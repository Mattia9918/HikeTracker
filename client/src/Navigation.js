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
                            <img src = "http://localhost:3000/navicon.svg" style = {{'height': '40px', 'marginLeft': '20px', 'marginTop': '-10px'}} alt = "navicon"/>
                            <b id = "title1">Hike</b>
                            <b id = "title2">Tracker</b>
                        </Navbar.Brand>
                        </Container>
                    </Col>

                    {/* Aria controls */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    {/* Dropdowns and links */}
                   <Container>
                    <Navbar.Collapse id="basic-navbar-nav" >
                        <Nav className="ms-auto">
                        <Nav.Item>
                            <Nav.Link onClick = {() => navigate('/login')}>Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick = {() => navigate('/register')}>Register</Nav.Link>
                        </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                    </Container> 
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;