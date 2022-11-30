import {Card,Row,Col,Button,Badge,ListGroup,ListGroupItem} from "react-bootstrap";
import { useState } from "react";
import "leaflet-area-select";


//Icon Libraries
import { BsCheckCircle,BsPhone } from "react-icons/bs";
import { FiMail} from "react-icons/fi";
import { TfiWorld} from "react-icons/tfi";
import {SlArrowDown,SlArrowUp} from 'react-icons/sl'
import {FaMountain,FaBed} from 'react-icons/fa';
import {GrLanguage,GrWheelchair} from 'react-icons/gr'; 
import {IoMdRestaurant} from 'react-icons/io'; 
import {MdOutlineBathtub,MdDirectionsBike} from 'react-icons/md';

import { normal,offroad,foot,cable,hutbike} from './HutsFilterOption'; 

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const CardImg = (props)=>{
	
	const reachability = props.reachability; 

	return <>
	<Card.Img
		className="mt-2"
		variant="top"
		src={
			(reachability === "normal" && normal) ||
			(reachability === "offroad" && offroad) ||
			(reachability === "foot" && foot) ||
			(reachability === "cable" && cable) ||
			hutbike
		}
	/>
	</>
}

const CardHeader = (props)=>{

	return <>
		<Card.Header>
			<Row>
				<Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6}>
					<b>
						{props.header}
					</b>
				</Col>

				<Col align="right">
					<Badge bg={"success"}>Available</Badge>
				</Col>
			</Row>
		</Card.Header>
	</>
}

const VisibleInfo = (props)=>{


	const {phone_number,email,web_site} = props.obj; 
	return <>
	<ListGroup className="mb-2" variant="flush">
		
		<ListGroupItem>
		 <BsPhone/>{" "+phone_number}
		</ListGroupItem>
		
		<ListGroupItem>
			<FiMail/> {" "+email}
		</ListGroupItem>
		
		<ListGroupItem>
			<TfiWorld/> {" "+web_site}
		</ListGroupItem>
	
	</ListGroup>
	</>
}

const Details = (props)=>{
	const [open, setOpen] = useState(false);

	const {description,altitude,languages,bathrooms,beds,bike_friendly,restaurant_service,disabled_service} = props.obj; 

	return <>
	{	!open && (
			<Button variant="link" onClick={() => setOpen(true)}>
				Show more{" "} <SlArrowDown/>
			</Button>
	)}

					
	{open && 
		<>
			<b className="mb-1 d-block">Details:</b>

			<div align="center" className="mb-4 mt-2"> <b>Description:</b> {description} </div>

			<Row>
				<Col> <><FaMountain/>{altitude} m </> </Col>
				
				<Col> <><GrLanguage/> {capitalizeFirstLetter(languages)}</> </Col>
				
				<Col> <><MdOutlineBathtub/> {bathrooms}</> </Col>
			</Row>

			<Row>
				<Col> <FaBed/> {beds} </Col>
				
				<Col>
				{bike_friendly !== 0 && (
						<><MdDirectionsBike/> <BsCheckCircle style={{ "color": "green" }} />
						</>
				)}
				</Col>
				<Col>
					{restaurant_service !== 0 && (
				
							<><IoMdRestaurant/> <BsCheckCircle style={{ "color": "green" }} />
							</>
					)}
				</Col>

				<Col>
					{disabled_service !== 0 && (
							
							<><GrWheelchair/> <BsCheckCircle style={{ "color": "green" }} />
							</>
					)}
				</Col>
			
			</Row>

			<Button variant="link" onClick={() => setOpen(false)}>
				Show less{" "}<SlArrowUp/>
			</Button>
	
		</>	
	}
	
	</>
}

export {CardImg,CardHeader,VisibleInfo,Details}; 


