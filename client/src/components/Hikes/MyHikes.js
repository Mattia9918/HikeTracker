import {
	Container,
	Row,
	Col,
    Table,
	ToggleButton,
	Collapse,
	Badge
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
			const startedHike = await APIHikes.getNotFinishedHike();
			//const startedHikeId = startedHike ? startedHike.hikeID : undefined;
			setStarted(startedHike);
			 
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
			{started.length === 0 ? null :
				<Row>
				<center>
					<Col lg={8} xs={12}>

						{/* <AlertUser obj={{ msg: props.msg, user: props.user, setMsg: props.setMsg }} /> */}
						{started.length === 0 ? 
								null
							: 
							<Container className="mt-3 shadow-sm p-2" id="cardscontainer">		
								
								<Row>
									<Col>
										<h4 className="text-success fw-bold">Escursione in corso</h4>
										<HikeList hikes={started}></HikeList>
									</Col>
								</Row>
							</Container>
							}
						
						

					</Col>
				</center>
				</Row>
			
			
			}
       		
			<Row>
				<center>
					<Col lg={8} xs={12}>
						<Container className="mt-3 mb-3  shadow-sm p-2" id="cardscontainer">
							
							<Row>
								<h4>Completed Hikes</h4>
							</Row>
							{hikes.length === 0 ? 
								<Row>
									<Col>
										<h1 className="fst-italic">Non hai terminanto nessuna escursione</h1>
										<h3 className="fst-italic">Inizia una nuova escursione </h3>
									</Col>
								</Row>
							: 
							
								<Row>
									<Col>
										<HikeList hikes={hikes}></HikeList>

									</Col>
								</Row>
							}
							

						
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
                <tbody className="bg-light">
                    
                    {
						props.hikes.map((hike) => <HikeRow hikes={hike} key={hike.start.hikeID}></HikeRow>)	
                       
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
						<h6 className="d-inline p-3 mb-2 float-end">Data: {adate.getDay()}/{adate.getMonth() +1 }/{adate.getFullYear()}</h6>	
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
								<div className="m-2 mt-5 p-2 fst-italic" >
									<p>{props.hikes.start.hikeDescription}</p>
								</div>
							
							</Col>
							
							
						</Row>

						{props.hikes.start.end_time !== null ? 
							<Row>
								<Col>
									
									<div className="m-2  p-2 fs-6">
										<p><b>Orario Inizio:</b> {sdate.getHours()}:{sdate.getUTCMinutes()}:{sdate.getSeconds()}</p>
										<p><b>Orario Fine:</b> {adate.getHours()}:{adate.getUTCMinutes()}:{adate.getSeconds()}</p>
										<p><b>Lunghezza escursione:</b> {props.hikes.start.len} km </p>
										<p><b>Tempo stimato:</b> {props.hikes.start.estimatedTime} ore</p>
									</div>
									
								</Col>
								<Col>
									<div className="m-2 p-2">
										<p><b>Difficoltà: </b> 
																	<Badge
																	bg={
																		(props.hikes.start.difficulty === "Easy" && "success") ||
																		(props.hikes.start.difficulty === "Average" && "warning") ||
																		(props.hikes.start.difficulty === "Difficult" && "danger")
																	}
																	>
																	{props.hikes.start.difficulty}
																	</Badge>
																</p>
										<p><b>Hai terminato l'escursione in:</b>   </p>
										<p>{Math.floor(((adate - sdate) / (1000 * 60 * 60 )) % 24 )} ore {Math.floor(((adate - sdate) / (1000 * 60 )) % 60 )} minuti e {Math.floor(((adate - sdate) / (1000)) % 60 )} secondi </p>

										<p><b>Media passo:</b> {(((props.hikes.start.len * 1000) / (Math.floor((adate - sdate) / (1000))) ) * 3.6).toFixed(2)} km/h</p>
									</div>
								</Col>
								<Col>
									<div className="m-2 p-2">
										<p><b>Partenza:</b></p>										
										<p><i> {props.hikes.start.city}, {props.hikes.start.province} </i></p>
										<p><b>Arrivo:</b></p>
										<p><i> {props.hikes.end.city}, {props.hikes.end.province} </i></p>
									</div>
								</Col>
							</Row>
						
						: 
							<Row>
								<Col>
									<div className="m-2  p-2 fs-6">
										<p><b>Orario Inizio:</b> {sdate.getHours()}:{sdate.getUTCMinutes()}:{sdate.getSeconds()}</p>
										<p><b>Lunghezza escursione:</b> {props.hikes.start.len} km </p>
										<p><b>Tempo stimato:</b> {props.hikes.start.estimatedTime} ore</p>
									</div>
								</Col>
								
								<Col>
								<div className="m-2 p-2">
										<p><b>Partenza:</b></p>										
										<p><i> {props.hikes.start.city}, {props.hikes.start.province} </i></p>
										<p><b>Arrivo:</b></p>
										<p><i> {props.hikes.end.city}, {props.hikes.end.province} </i></p>
									</div>
								</Col>
							</Row>
						}
						
					</div>
					


				</Collapse>
				
			</td>
        </tr>
    )
    
}





export default MyHikes; 