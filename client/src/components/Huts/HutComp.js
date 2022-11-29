import {Card,Row,Col,Button,Badge,ListGroup,ListGroupItem} from "react-bootstrap";
import { useState } from "react";
import "leaflet-area-select";
import { BsCheckCircle,BsPhone } from "react-icons/bs";
import { FiMail} from "react-icons/fi";
import { TfiWorld} from "react-icons/tfi";
import {SlArrowDown,SlArrowUp} from 'react-icons/sl'

const url = "http://localhost:3000/images/"; 
const normal = url+"nicehut.jpg"; 
const offroad = url+"huttra.jpg"; 
const foot = url+"rifugetto.jpg"; 
const cable = url+"rifugiobello.jpg"; 
const hutbike = url+"hutbike.jpg"; 

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

	//<b>Phone number:</b> 
	//<b>Email:</b>
	//<b>Web Site:</b>
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

					
	{open && (
		<>
			<b className="mb-1 d-block">Details:</b>
			
			<ListGroup className="mt-2">
				<ListGroupItem>
					<b>Description:</b> {description}
				</ListGroupItem>
				
				<ListGroupItem>
					<b>Altitude:</b> {altitude}
				</ListGroupItem>
				
				<ListGroupItem>
					<b>Languages:</b> {capitalizeFirstLetter(languages)}
				</ListGroupItem>

				<ListGroupItem>
					<b>Bathrooms:</b> {bathrooms}
				</ListGroupItem>

				<ListGroupItem>
					<b>Bedrooms:</b> {beds}
				</ListGroupItem>
				
				{bike_friendly !== 0 && (
					<ListGroupItem>
						<b>Bike friendly <BsCheckCircle style={{ "color": "green" }} /></b>
					</ListGroupItem>
				)}
				{restaurant_service !== 0 && (
					<ListGroupItem>
						<b>Restaurant service <BsCheckCircle style={{ "color": "green" }} /></b>
					</ListGroupItem>
				)}
				{disabled_service !== 0 && (
					<ListGroupItem>
						<b>Disabled services <BsCheckCircle style={{ "color": "green" }} /></b>
					</ListGroupItem>
				)}
			</ListGroup>
			<Button variant="link" onClick={() => setOpen(false)}>
				Show less{" "}<SlArrowUp/>
			</Button>
		</>
	)}
	</>
}

export {CardImg,CardHeader,VisibleInfo,Details}; 