import {
	Container,
	Card,
	Row,
	Col,
	Button,
	Accordion,
	ButtonGroup,
    Table,
	ToggleButton,
	Collapse
} from "react-bootstrap";
import { useState, useEffect } from "react";

import { MapModal } from "../Map/Maps";

import { AccordionFilter, AccordionGeo } from "../Filter";
import {
	length,
	time,
	difficulty,
	ascent,
	objProv,
	objCity,
} from "./HikesObjInfo";

import APIHikes from "../../API/APIHikes";

import { TbMapSearch } from "react-icons/tb";
import { BsMap } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { RiMindMap } from "react-icons/ri";

import {
	CardImg,
	AlertUser,
	CardHeader,
	VisibleItem,
	HiddenItem,
} from "./HikeCardComp";
import { LinkingModal } from "../Linking/Linking";
import { HikeStatusModal } from "../HikeStatus/HikeStatus";


function MyHikes(props) {
    
    const [hikes, setHikes] = useState([]);
    const [started, setStarted] = useState([]);

    async function loadHikes() {
		try {
			const hikeList = await APIHikes.getCompletedHikes();
            console.log(hikeList); 
			setHikes(hikeList);
		}
		catch (err) {
			console.log(err);
		}
	};
	async function loadStarted() {
		try {
			const startedHike = await APIHikes.getStartedHike();
			const startedHikeId = startedHike ? startedHike.hikeID : undefined;
			setStarted(startedHikeId)
		} catch (err) {
			console.log(err);
		}
	}

    
	useEffect(() => {
		loadHikes();
		loadStarted();
	}, []);
		  
	

    

    return(
        <>
        <Row>
				<center>
					<Col lg={8} xs={12}>

						{/* <AlertUser obj={{ msg: props.msg, user: props.user, setMsg: props.setMsg }} /> */}

						<Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
							
                            
                            <Row>
								<Col>
									{Object.keys(started).lenght === 0 ? null :  <HikeList hikes={started}></HikeList>}
                                </Col>
                                
		
								
							</Row>
                            <Row>
								{}
                                <h6>Completed Hikes</h6>
                            </Row>
                            <Row>
                                <Col>
                                    <HikeList hikes={hikes}></HikeList>
                                    
                                
                                </Col>
                            </Row>

						</Container>

					</Col>
				</center>
			</Row>



        </>
    ); 
}

function HikeList(props){
    return(
        <>
            <Table>
                <tbody>
                    
                    {
						props.hikes.map((hike) => <HikeRow hikes={hike}></HikeRow>)
                       
                    }

                </tbody>
            </Table>
        </>
    )
}

function HikeRow(props) {

    const [open, setOpen] = useState(false); 
 
    return (
        <tr>
            <td>
				
				<h6>{props.hikes.start.title}</h6>	
				<ToggleButton
                    variant="outline-primary"
                    size="sm"
                    className="float-end m-2"
                    onClick={() => setOpen(!open)}
                    
                    aria-expanded={open}>
                    {open ? <i className="bi bi-arrow-bar-up"></i> : <i className="bi bi-arrow-bar-down "></i>}
                </ToggleButton>

				<Collapse in={open} >

                    <div className="m-2 p-2 " >
						
                    </div>

                </Collapse>
			</td>
        </tr>
    )
    
}





export default MyHikes; 