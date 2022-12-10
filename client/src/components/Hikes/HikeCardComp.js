import {  Card,Col,Row, Badge, Alert,ListGroup,ListGroupItem } from 'react-bootstrap';
import {  useState } from 'react';

import {easyHikeImg,avgHikeImg,diffHikeImg} from './HikesObjInfo'; 

import {FiMapPin} from 'react-icons/fi';
import {FaFlagCheckered} from 'react-icons/fa';
import {BiChevronDown,BiChevronUp} from 'react-icons/bi';
import { AiOutlineHome } from 'react-icons/ai';
import { RiParkingBoxLine } from 'react-icons/ri'



const AlertUser = (props)=>{

    const [show,setShow] = useState(); 
    const {msg,user,setMsg} = props.obj; 

    const close = ()=>{
        setMsg("");
        setShow(false);
    }

    return <>
     {(msg.message === "You have been logged out!" || (user && msg.message === `Welcome ${user.username}!`)) &&
            <Alert variant={msg.type} onClose={close} show={show} dismissible>
                {msg.message}
            </Alert>
    }
    </>; 
}

const VisibleItem = (props)=>{

    const size="1.1rem";



    return <>
        
        <Row id = "infocontainer" className = "mt-4"  align = "center">

            <Col>
                <div><i className="bi bi-geo-alt"   style={{"fontSize":size}}/></div>
                <i id = "smallfont">{props.hike.startingPoint.city}</i>
            </Col>

            <Col>
                {props.hike.ascent > 0 ? 
                    <div><i className="bi bi-arrow-up-right-square"  style={{"fontSize":size}}/></div> : 
                    
                    <div><i className="bi bi-arrow-down-right-square"  style={{"fontSize":size}} />
                    </div>
                }
                 <i id = "smallfont">{props.hike.ascent} m</i>
            </Col>

            <Col>
                <div><i className="bi bi-stopwatch" style={{"fontSize":size}} /></div>
                <i id = "smallfont">{props.hike.estimatedTime} h </i>
            </Col>
            
            <Col>
                <div><i className="bi bi-cursor"  style={{"fontSize":size}}/></div>
                <i id = "smallfont">{props.hike.length} km</i>
            </Col>
        </Row>
        
        <Row className = "mt-4">
            {!props.open ? <BiChevronDown fontSize="2.2rem"/>:<BiChevronUp fontSize="2.2rem"/>}
        </Row>
    </>;
}


const HiddenItem = (props)=>{

    const description = props.hike.description; 
    const start = props.hike.startingPoint; 
    const end = props.hike.endingPoint; 
    let [startText, endText] = getProperText([start.type, end.type]);
    
    return <>
   
        <Card.Text className="mb-3">
            {description}
        </Card.Text>

        <ListGroup className = "mb-3">
            
            <ListGroupItem>
                {(start.type === "hut" && <AiOutlineHome style = {{'marginTop': '-3px'}} />) ||
                 (start.type === "parking" && <RiParkingBoxLine style = {{'marginTop': '-3px'}}/>) ||
                 <FiMapPin/>}
                {"  "}<b>{startText}</b>{start.city}, {start.province}
                    <Badge bg = "primary" className = "ms-3">Start</Badge><br/>
                <ListGroup variant = "flush" id = "smallgroups">
                    <ListGroupItem>
                        <i>latitude</i>: {start.latitude}
                    </ListGroupItem>
                    <ListGroupItem>
                        <i>longitude</i>: {start.longitude}
                    </ListGroupItem>
                </ListGroup>
            </ListGroupItem>
            
            <ListGroupItem>
                {(end.type === "hut" && <AiOutlineHome style = {{'marginTop': '-3px'}}/>) ||
                 (end.type === "parking" && <RiParkingBoxLine style = {{'marginTop': '-3px'}} />) ||
                 <FiMapPin/>}
                {" "}<b>{endText}</b>{end.city}, {end.province}
                    <Badge bg = "primary" className = "ms-3">End</Badge><br/>
                <ListGroup variant = "flush" id = "smallgroups">
                    <ListGroupItem>
                        <i>latitude</i>: {end.latitude}
                    </ListGroupItem>
                    <ListGroupItem>
                        <i>longitude</i>: {end.longitude}
                    </ListGroupItem>
                </ListGroup>
                
            </ListGroupItem>
        </ListGroup>
        
        </>
    
    
    
}


const CardImg = (props)=>{
	
	const difficulty = props.difficulty; 

	return <>
        <Card.Img
            className="mt-2"
            variant="top"
            src={
                (difficulty === "Easy" && easyHikeImg) ||
                (difficulty === "Average" && avgHikeImg) ||
                (difficulty === "Difficult" && diffHikeImg) 	
            }
        />
	</>
}


const CardHeader = (props)=>{

    const {user,level} = props.obj; 
    return <>
        <Card.Header>
            <Row>
                <Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6} align="left">
                    <b>Posted by: </b> {user}
                </Col>
                        
                <Col align="right">
                    <Badge bg={
                        (level === "Easy" && "success") ||
                        (level === "Average" && "warning") ||
                        (level === "Difficult" && "danger")}>
                        {level}
                    </Badge>
                </Col>
            </Row>
        </Card.Header>
    </>
}

function getProperText(pointTypes) {
    let result = [];

    for (let i = 0; i < 2; i++) {
        switch(pointTypes[i]) {
            case "hut":
                result[i] = "Hut in: "
                break;
            
            case "parking":
                result[i] = "Parking in: "
                break;
    
            default:
                result[i] = ""
                break;
        }
    }

    return result;
    
}

export {HiddenItem,AlertUser,CardHeader,VisibleItem,CardImg}; 

