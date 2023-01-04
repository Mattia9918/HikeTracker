import {
	Container,
	Row,
	Col,
    Table,
	ToggleButton,
	Collapse
} from "react-bootstrap";
import { useState, useEffect } from "react";



import APIHikes from "../../API/APIHikes";



import {
	CardImg,
} from "./HikeCardComp";



function MyHikes(props) {
    
    const [hikes, setHikes] = useState([]);
    const [started, setStarted] = useState([]);

    async function loadHikes() {
		try {
			const hikeList = await APIHikes.getCompletedHikes();
            
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
	const sdate = new Date(props.hikes.start.start_time); 
	const adate = new Date(props.hikes.start.end_time); 
	const diffDate = Math.abs(adate - sdate); 
	
    return (
        <tr className="border border-1">
            <td className="m-2 p-2">
				<Row>
					<Col>
						<br></br>
						<h4 className="d-inline p-3 mb-2">{props.hikes.start.title}</h4>
												
						<ToggleButton
							variant="outline-primary"
							size="sm"
							className="float-end m-2"
							onClick={() => setOpen(!open)}
							
							aria-expanded={open}>
							{open ? <i className="bi bi-arrow-bar-up"></i> : <i className="bi bi-arrow-bar-down "></i>}
						</ToggleButton>
						<h6 className="d-inline p-3 mb-2 float-end">Date: {props.hikes.start.end_time}</h6>	
					</Col>

				</Row>
				<Collapse in={open} >
					<div>
						<Row>
							<Col>
								
								<div className="m-2 p-2" >
									<CardImg imgPath={props.hikes.start.imgPath} />
								</div>
								
							</Col>
							<Col>
								<div className="m-2 mt-4 p-2 fst-italic" >
									<p>{props.hikes.start.hikeDescription}</p>
								</div>
							
							</Col>
							
							
						</Row>
						<Row>
						<Col>
								<div className="m-2  p-2 fs-6" >
									<p>Orario Inizio: {adate.getTime()}</p>
									<p>Orario Fine: {props.hikes.start.end_time}</p>
									<p>Hike lenght: {props.hikes.start.len} km </p>
									<p>Estimated time: {props.hikes.start.estimatedTime} hours</p>
								</div>
							
							</Col>
						<Col>
							<div className="m-2 p-2" >
								<p>Hai terminato l'escursione in:   </p>
								<p>{Math.floor((diffDate) / (1000 * 60 * 60 * 24) )} giorni - {Math.floor(((adate - sdate) / (1000 * 60 * 60 )) % 24 )} ore</p>
								
								<p>{Math.floor(((adate - sdate) / (1000 * 60 )) % 60 )} minuti e {Math.floor(((adate - sdate) / (1000)) % 60 )} secondi </p>

								<p>Media passo: {(((props.hikes.start.len * 1000) / (Math.floor((adate - sdate) / (1000))) ) * 3.6).toFixed(2)} km/h</p>
							</div>

						</Col>
						<Col>
							<div className="m-2 p-2" >
								
								<p>Partenza:</p>
								<p> {props.hikes.start.city}, {props.hikes.start.province} </p>
								<p>Arrivo:</p>
								<p> {props.hikes.end.city}, {props.hikes.end.province} </p>
							
							</div>
						
						
						</Col>
						
						

						</Row>
					</div>
					


				</Collapse>
				
			</td>
        </tr>
    )
    
}





export default MyHikes; 