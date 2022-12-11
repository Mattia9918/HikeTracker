import {Card,Row,Col,Badge,ListGroup,ListGroupItem} from "react-bootstrap";
import "leaflet-area-select";


//Icon Libraries
import { BsCheckCircle,BsPhone } from "react-icons/bs";
import { FiMail} from "react-icons/fi";
import { TfiWorld} from "react-icons/tfi";
import {FaMountain,FaBed} from 'react-icons/fa';
import {GrLanguage,GrWheelchair} from 'react-icons/gr'; 
import {IoMdRestaurant} from 'react-icons/io'; 
import {MdOutlineBathtub,MdDirectionsBike} from 'react-icons/md';
import {BiChevronDown,BiChevronUp, BiCurrentLocation} from 'react-icons/bi';
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
			(reachability === "With normal car" && normal) ||
			(reachability === "With off-road car" && offroad) ||
			(reachability === "On foot" && foot) ||
			(reachability === "Cableway" && cable) ||
			hutbike
		}
	/>
	</>
}

const CardHeader = (props)=>{

	return <>
		<Card.Header>
			<Row align = "left">
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

const VisibleItem = (props)=>{


	const {phone_number,email,web_site} = props.obj; 
	return <>
	<Row id = "infocontainer" className = "mt-4"  align = "center">

		<Col>
			<div><BsPhone/></div>
			<i id = "smallfont">{phone_number}</i>
		</Col>

		<Col>
			<div><FiMail/></div>
			<i id = "smallfont">{email}</i>
		</Col>

		<Col>
			<div><TfiWorld/></div>
			<i id = "smallfont">{web_site}</i>
		</Col>
	</Row>

	<Row className = "mt-4">
		{!props.open ? <BiChevronDown fontSize="2.2rem"/>:<BiChevronUp fontSize="2.2rem"/>}
	</Row>	
	</>
}

const HiddenItem = (props)=>{

	const {description,address,altitude,languages,bathrooms,beds,bike_friendly,restaurant_service,disabled_service} = props.obj; 

	return <>
					
	{props.open && 
		<>
		<Card.Text className="mb-3">
            {description}
        </Card.Text>

        <ListGroup className = "mb-3">
			<ListGroupItem>
				<BiCurrentLocation/>
                <b> Address: </b>{address}
            </ListGroupItem>

            <ListGroupItem>
				<FaMountain/>
                <b> Altitude: </b>{altitude} m
            </ListGroupItem>
            
            <ListGroupItem>
				<GrLanguage/>
                <b> Spoken languages: </b>{capitalizeFirstLetter(languages)}
            </ListGroupItem>

			<ListGroupItem>
				<MdOutlineBathtub/>
                <b> Bathrooms: </b>{bathrooms}
            </ListGroupItem>

			<ListGroupItem>
				<FaBed/>
                <b> Beds: </b>{beds}
            </ListGroupItem>

			<ListGroupItem>
                <b> Services: </b>
				<Row className = "mt-2">
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
            </ListGroupItem>
        </ListGroup>
		</>	
	}
	
	</>
}

export {CardImg,CardHeader,VisibleItem,HiddenItem}; 


