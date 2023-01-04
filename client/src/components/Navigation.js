import {Navbar, Container, Col, Nav,  NavDropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function Navigation(props) {
    const navigate = useNavigate();
    const localGuideActions = [
        {
            name: "New hike",
            link: "/newhike"
        },
        {
            name: "New hut",
            link: "/newhut"
        },
        {
            name: "New parking lot",
            link: "/newparking"
        }
    ]

    const hikerActions = [
        {
            name: "Hikes",
            link: "/"
        },
        {
            name: "Huts",
            link: "/huts"
        },
        {
            name: "My Hikes",
            link: "/myHikes"
        },
    ]
    return (
        <>

            {/* -- NAVBAR -- */}

            <Navbar bg="light" expand="lg" >
                <Container fluid className="shadow-sm p-2" id="topbar">

                    <Col className="col-3">
                        {/* Logo and brand */}
                        <Container>
                        <Navbar.Brand>
                            <img src = "http://localhost:3000/brand.svg" style = {{'height': '50px', 'marginLeft': '20px', 'marginTop': '-10px', 'cursor': 'pointer' }}
                                onClick = {() => navigate('/')}
                                alt = "navicon"/>
                        </Navbar.Brand>
                        </Container>
                    </Col>

                    {/* Aria controls */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    {/* Dropdowns and links */}
                    <Navbar.Collapse id="basic-navbar-nav" align = "right" >
                        <Nav className="ms-auto">
                        {props.user !== undefined && props.user.role === "localGuide" && <MyNavDropdown array = {localGuideActions} label = "Local Guide Menu"/>}
                        {props.user !== undefined && <MyNavDropdown array = {hikerActions} label = "Menu"/>}
                        <Nav.Item>
                            {props.user === undefined && <Nav.Link id = "navlink" onClick = {() => navigate('/login')}>Login</Nav.Link>}
                        </Nav.Item>
                        <Nav.Item>
                            {(props.user === undefined && 
                                    <Nav.Link id = "navlink" onClick = {() => navigate('/register')}>Register</Nav.Link>) ||
                                    <Nav.Link id = "navlink" onClick = {() => props.logout()}>Logout</Nav.Link>
                            }
                        </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                    </Container> 
            </Navbar>
        </>
    );
};

function MyNavDropdown(props) {

    const navigate = useNavigate();

    return (
      <NavDropdown title={props.label}>
        {props.array.map(a => <NavDropdown.Item key={props.label+props.array.indexOf(a)} onClick = {() => navigate(a.link)}>{a.name}</NavDropdown.Item>)}
      </NavDropdown>
    );
  }
  
  

export default Navigation;
