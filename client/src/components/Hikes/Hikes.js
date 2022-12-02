import { Container, Card, Row, Col, Button,Accordion, ButtonGroup } from 'react-bootstrap';
import {  useState,useEffect } from 'react';

import {MapModal} from '../Map/Maps';

import {AccordionFilter,AccordionGeo} from '../Filter'; 
import {length,time,difficulty,ascent,objProv,objCity} from './HikesObjInfo'; 

import APIHikes from '../../API/APIHikes';

import {TbMapSearch} from 'react-icons/tb';
import {BsMap} from 'react-icons/bs';
import {GrPowerReset} from 'react-icons/gr'; 

import  {CardImg,AlertUser,CardHeader, VisibleItem, HiddenItem} from './HikeCardComp'; 


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
                                        <ButtonGroup>
                                            
                                                <Button variant = "outline-primary" onClick = {() => {setShowModal(true)}}>
                                                    <TbMapSearch style={{fontSize:"1.2rem"}}/>{" "}Find
                                                </Button>
                                                
                                                <Button variant="outline-primary" onClick={() => props.loadFilter("none")}>
                                                    <GrPowerReset/>{" "}Reset
                                                </Button>
                                           
                                        </ButtonGroup>
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

    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    

    return (
        <Container className="mt-3 mb-3">
            <Card className="shadow-sm p-2">
                {/* -- CARD HEADER -- */}
                
                <CardHeader obj={{user:props.hike.localguideUsername,
                                level:props.hike.difficulty}}/>


                <CardImg difficulty={props.hike.difficulty}/>

                
                {/* -- CARD BODY -- */}
                <Card.Body className = "pb-0" id = "cardbody" style = {{'cursor': 'pointer'}} onClick = {() => setOpen((prev) => !prev)}>

                    <Card.Title align="center">{props.hike.title}</Card.Title>

                   
                        <VisibleItem hike={props.hike} open={open}/>
                   
                        {open && <HiddenItem hike={props.hike}/>}
                
                </Card.Body>
                
                <Col align="right" className="mb-1 mx-2">
                { (props.user) && 

                        <Button variant="link" style={{padding:"0",margin:"0"}} 
                                        onClick={() => setShowModal(true)}>
                            <BsMap/>
                        </Button>           
                }
                </Col>

                
            </Card>

            {showModal && <MapModal 
                    obj={{showModal,setShowModal,title:props.hike.title,hikeid:props.hike.id}}
             />}

        </Container>
    );
};

function Hikes(props) {

    const [hikes, setHikes] = useState([]);    
  
    async function loadFilter(filter, value) {
        try {
          const filteredHikeList = await APIHikes.getFilter(filter, value);
          setHikes(filteredHikeList);
        } catch (err) {
            console.log(err);
        }
    };
    
    async function loadHikes() {
        try {
          const hikeList = await APIHikes.getHikes();
          setHikes(hikeList);
        } 
        catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
        loadHikes();
    }, []);


    const leftHikes = hikes.filter(v=>hikes.indexOf(v)<hikes.length/2); 
    const rightHikes = hikes.filter(v=>hikes.indexOf(v)>=hikes.length/2); 
    
    return (
        <>
            <Row>
                <center>
                <Col lg={8} xs={12}>
                    
                   <AlertUser obj={{msg:props.msg,user:props.user,setMsg:props.setMsg}}/>

                    <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
                        <FilterMenu loadFilter = {loadFilter} />
                        
                        <Row>
                            {(hikes.length === 1 && hikes[0].id === undefined) ||
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