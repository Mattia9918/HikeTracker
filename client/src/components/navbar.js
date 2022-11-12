import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function MyNavbar(props) {
    // const navigate = useNavigate();
    return (
        <Navbar fixed="top" bg="primary" variant="dark">
            <Container fluid>
                <Navbar.Brand style={{ cursor: 'pointer' }}  >Home Page</Navbar.Brand>

                <Nav>
                    Hike Tracker
                </Nav>

            </Container>
        </Navbar>
    );
}
export default MyNavbar;