import {Navbar, Container, Col, Nav, Form, Row, Button} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {useState} from 'react';


function Navigation(props) {

    const url = window.location.href;
    const navigate = useNavigate();
    return (
        <>

            {/* -- NAVBAR -- */}

            <Navbar bg="light" expand="lg">
                <Container fluid className="shadow-sm p-2" id="topbar">

                    <Col className="col-3">
                        {/* Logo and brand */}
                        <Container>
                        <Navbar.Brand>
                            <img src = "http://localhost:3000/navicon.svg" style = {{'height': '40px', 'marginLeft': '20px', 'marginTop': '-10px', 'cursor': 'pointer' }}
                                onClick = {() => navigate('/')}
                                alt = "navicon"/>
                            <b id = "title1" style = {{'cursor': 'pointer'}} onClick = {() => navigate('/')}>Hike</b>
                            <b id = "title2" style = {{'cursor': 'pointer'}} onClick = {() => navigate('/')}>Tracker</b>
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
                            {
                                props.user === undefined && <Nav.Link id = "navlink" onClick = {() => navigate('/login')}>Login</Nav.Link> ||
                                props.user.role === "localGuide" &&  url !== "http://localhost:3000/newhike" && <Nav.Link onClick = {() => navigate('/newhike')}>New hike</Nav.Link>
                            }
                        </Nav.Item>
                        <Nav.Item>
                            {props.user === undefined && 
                                <Nav.Link id = "navlink" onClick = {() => navigate('/register')}>Register</Nav.Link> ||
                                <Nav.Link id = "navlink" onClick = {() => props.logout()}>Logout</Nav.Link>
                            }
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