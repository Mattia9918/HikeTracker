import { Container, Card, Row, Col, Button,Accordion } from 'react-bootstrap';
import {  useState,useEffect } from 'react';

import {MapModal} from '../Map/Maps';

import {AccordionFilter,AccordionGeo} from '../Filter'; 
import {length,time,difficulty,ascent,objProv,objCity} from './HikesFilterOption'; 

import APIHikes from '../../API/APIHikes';


import {BsMap} from 'react-icons/bs';
import {SlArrowDown,SlArrowUp} from 'react-icons/sl'


import  {Level,Details,AlertUser,PostedBy} from './HikeCardComp'; 


const url = "http://localhost:3000/images/"; 
const easyHikeImg = url+"easyhike.jpg"; 
const avgHikeImg = url+"averagehike.jpg"; 
const diffHikeImg = url+"difficulthike.jpg"; 


function FilterMenu(props) {

    const [cities, setCities] = useState();
    const [provinces, setProvinces] = useState();
    const [showModal, setShowModal] = useState(false);

   
    
    useEffect(()=>{
        async function loadList() {

            const citieslist = await APIHikes.getHikeCities();
            setCities(citieslist);
            
            const provincelist = await APIHikes.getHikeProvinces();
            setProvinces(provincelist);
            
        }
        loadList();
    },[]); 

    
    return (
        <>
        <Row className = "mt-3 mb-1 ms-1 me-1">
                <Accordion >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Filtering options</Accordion.Header>
                        <Accordion.Body>
                            <Accordion>
                                <Row>
                                    <Col lg = {4}>

                                        <AccordionFilter obj={length} loadFilter={props.loadFilter}/>
                                        
                                        <AccordionFilter obj={time} loadFilter={props.loadFilter}/>

                                        <AccordionFilter obj={difficulty} loadFilter={props.loadFilter}/>
                                        
                                    </Col>
                                
                                    <Col lg = {4}>

                                        <AccordionFilter obj={ascent} loadFilter={props.loadFilter}/>

                                        <AccordionGeo obj={objProv} cities={provinces} loadFilter={props.loadFilter}/>
                                        
                                        <AccordionGeo obj={objCity} cities={cities} loadFilter={props.loadFilter}/>
                                        
                                    </Col>

                                    <Col lg = {4}>
                                        <center className="mb-3">
                                            <Button variant = "outline-primary" onClick = {() => {setShowModal(true)}}>Find in geographic area</Button>
                                        </center>
                                   
                                        <center>
                                            <Button align = "right" onClick={() => props.loadFilter("none")}>Reset filters</Button>
                                        </center>
                                    </Col>
                                </Row>
                            </Accordion>

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
        </Row>

        {showModal && <MapModal 
            obj={{showModal,setShowModal,areadragmap:true,loadFilter:props.loadFilter}}/>}
        </>
    );
}

function HikeCard(props) {

    const [open, setOpen] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const difficulty = props.hike.difficulty

    return (
        <Container className="mt-3 mb-3">
            <Card className="shadow-sm p-2">
                {/* -- CARD HEADER -- */}
                <Card.Header>
                    <Row>
                        <PostedBy user={props.hike.localguideUsername}/>
                        <Level level={props.hike.difficulty}/>
                    </Row>
                </Card.Header>

                <Card.Title className="mt-2">{props.hike.title}</Card.Title>

                <Card.Img className="mt-2" variant="top" src={
                    (difficulty === "Easy" && easyHikeImg) ||
                    (difficulty === "Average" && avgHikeImg) ||
                    (difficulty === "Difficult" && diffHikeImg)
                } />

                <Card.Text >
                    {props.hike.description}
                </Card.Text>
                
                {/* -- CARD BODY -- */}
                <Card.Body>
                    
                    <Col align="right">
                        {(open === 0 &&
                            <>
                                {props.user && 
                                    <Button variant="link" style={{padding:"0",margin:"0"}} onClick={() => setShowModal(true)}>
                                        <BsMap/>
                                    </Button>
                                }
                                <Button variant="link" onClick={() => setOpen(1)}>
                                    <SlArrowDown/>
                                </Button>
                            </>) 
                            
                        }
                    </Col>
                </Card.Body>

                {open!==0 && <>
                                <Details hike={props.hike}/>
                                <Button variant="link"  onClick={() => setOpen(0)}>
                                    <SlArrowUp/>
                                </Button>
                            </>
                }
                
            </Card>

            {showModal && <MapModal 
                    obj={{showModal,setShowModal,title:props.hike.title,hikeid:props.hike.id}}
             />}

        </Container>
    );
};

function Hikes(props) {

    const vett = props.hikes; 

    const leftHikes = vett.filter(v=>vett.indexOf(v)<vett.length/2); 
    const rightHikes = vett.filter(v=>vett.indexOf(v)>=vett.length/2); 
    
    return (
        <>
            <Row>
                <center>
                <Col lg={8} xs={12}>
                    
                   <AlertUser obj={{msg:props.msg,user:props.user,setMsg:props.setMsg}}/>

                    <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
                        <FilterMenu loadFilter = {props.loadFilter} />
                        
                        <Row>
                            {(props.hikes.length === 1 && props.hikes[0].id === undefined) ||
                                <>
                                    <Col lg = {6} xs = {12}>
                                        {leftHikes.map(hike=><HikeCard key={"cardHike_"+hike.id} hike={hike} user={props.user}/>)}
                                    </Col>
                                    
                                    <Col>
                                        {rightHikes.map(hike=><HikeCard key={"cardHike_"+hike.id} hike={hike} user={props.user}/>)}
                                    </Col>
                                </>
                            }
                        </Row>

                    </Container>
                
                </Col>
                </center>
            </Row>
        </>
    )
};




export default Hikes;