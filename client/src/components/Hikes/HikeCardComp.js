import {  Card,Col,Row, Badge, Alert,ListGroup,ListGroupItem } from 'react-bootstrap';
import {  useState } from 'react';

import {easyHikeImg,avgHikeImg,diffHikeImg} from './HikesObjInfo'; 

import {FiMapPin} from 'react-icons/fi';
import {FaFlagCheckered} from 'react-icons/fa';
import {BiChevronDown,BiChevronUp} from 'react-icons/bi';



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

    //const {ascent,length,estimatedTime} = props.hike; 
    const size="1.1rem";



    return <>
        
        <Row id = "infocontainer" className = "mt-4"  align = "center">

            <Col>
                <div><i class="bi bi-geo-alt"   style={{"font-size":size}}/></div>
                {props.hike.startingPoint.city}
            </Col>

            <Col>
                {props.hike.ascent > 0 ? 
                    <div><i class="bi bi-arrow-up-right-square"  style={{"font-size":size}}/></div> : 
                    
                    <div><i class="bi bi-arrow-down-right-square"  style={{"font-size":size}} />
                    </div>
                }
                {props.hike.ascent} m
            </Col>

            <Col>
                <div><i class="bi bi-stopwatch" style={{"font-size":size}} /></div>
                {props.hike.estimatedTime} h 
            </Col>
            
            <Col>
                <div><i class="bi bi-cursor"  style={{"font-size":size}}/></div>
                {props.hike.length} km
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
    
    //const {ascent,length,estimatedTime} = props.hike; 
    
    return <>
   
        <Card.Text className="mb-0">
            {description}
        </Card.Text>

       <b className="d-block mt-0 mb-2 mx-1" align={"left"}>Details:</b>
        <ListGroup >
            
            <ListGroupItem>
                <FiMapPin/>
                ({start.city},{start.province})<br/>
                <i>(lat: {start.latitude} - long: {start.longitude})
                </i>
            </ListGroupItem>
            
            <ListGroupItem>
                <FaFlagCheckered/>
                ({end.city},{end.province})<br/>
                <i>(lat: {end.latitude} ,long: {end.longitude}) - </i>
                
            </ListGroupItem>
            
            {/*
            <ListGroupItem>
               <GiPathDistance/> <b>Length: </b>{length} km
            </ListGroupItem>
            
            <ListGroupItem>
                <MdEscalator/> <b>Ascent: </b>{ascent} m
            </ListGroupItem>
            
            <ListGroupItem>
               <BiTime/> <b>Estimated Time: </b>{estimatedTime} h
            </ListGroupItem>
            */}   
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

export {HiddenItem,AlertUser,CardHeader,VisibleItem,CardImg}; 

/*
<div>
            <span className='mx-2'>
                <GiPathDistance/>{" "+length} km
            </span>

            <span className='mx-2'>
                {ascent>=0 ? <BsArrowUpRight/>:<BsArrowDownRight/>}{" "+ascent} m
            </span>
            
            <span className='mx-2'>
                <MdTimer/> {" "+estimatedTime} h
            </span>
        </div>
        
*/