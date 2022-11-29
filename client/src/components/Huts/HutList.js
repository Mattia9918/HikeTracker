import {Container,Card,Row,Col,Button,Accordion} from "react-bootstrap";
import {  useState,useEffect } from 'react';
import APIHikes from '../../API/APIHikes';
import "leaflet-area-select";
import {CardImg,CardHeader,VisibleInfo,Details} from './HutComp';

import {AccordionFilter,AccordionGeo} from '../Filter'; 

import { MapModal } from "../Map/Maps";


function HutList(props) {

	
    const leftArray = props.huts.filter(v=>props.huts.indexOf(v)<props.huts.length/2); 
    const rightArray = props.huts.filter(v=>props.huts.indexOf(v)>=props.huts.length/2); 

	
	
	return (
		<>
			<Row>
				<Col></Col>
				<Col lg={8} xs={12}>
					<Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
						<FilterMenu loadFilter={props.loadHutsFilter} loadByArea={props.loadByArea} />
						<Row>
							<Col lg={6} xs={12}>
								{leftArray.map((Hut) => (
									<HutCard key={Hut.id} Hut={Hut} user={props.user} />
								))}
							</Col>
							<Col>
								{rightArray.map((Hut) => (
									<HutCard key={Hut.id} Hut={Hut} user={props.user} />
								))}
							</Col>
						</Row>
					</Container>
				</Col>
				<Col></Col>
			</Row>
		</>
	);
}

function HutCard(props) {
	
	const {name,province,city,address,phone_number,email,web_site,reachability} = props.Hut; 
	const {description,altitude,languages,bathrooms,beds,bike_friendly,restaurant_service,disabled_service} = props.Hut

	const objDetails = {description,altitude,languages,bathrooms,beds,bike_friendly,restaurant_service,disabled_service};
	 

	const header = name+","+province+","+city; 

	return (
		<Container className="mt-3 mb-3">
			<Card className="shadow-sm p-2">
				{/* -- CARD HEADER -- */}
				
				<CardHeader header={header}/>
				
				<CardImg reachability={reachability}/>

				{/* -- CARD BODY -- */}
				<Card.Body>
					<Card.Title>{address}</Card.Title>
					
					<Card.Text>
						<VisibleInfo obj={{phone_number,email,web_site}}/>
					</Card.Text>

				</Card.Body>

				<Details obj={objDetails}/>
			</Card>
		</Container>
	);
}

const BtnFilter = (props)=>{

	const {size,style,variant,btnFn,label} = props.obj; 

	

	return <>
		<Button size={size} style={style} variant={variant} onClick={btnFn}>
			{label}
		</Button>
	</>
}

const FilterMenuBtn = (props)=>{

	const {loadFilter,setShowModal} = props.obj; 


	const [selected, setSelected] = useState("");
	
	const buttonValues = [];
	buttonValues["restaurant"] = "outline-primary";
	buttonValues["disability"] = "outline-primary";
	buttonValues["sleep"] = "outline-primary";
	buttonValues["bike"] = "outline-primary";
	buttonValues["area"] = "outline-primary";

	buttonValues[selected] = "primary";


	const btnFn = (select,filter)=>{
		setSelected(select);
		loadFilter(filter);
	}
	const btnArea = (filter)=>{
		setSelected(filter)
		setShowModal(true); 
	}
	const resetFn = ()=>{
		loadFilter("none");
		setSelected("");
	}

	//variant={buttonValues["restaurant"]}
	//size="sm"
	//style={ width: "10" }


	const restObj = {
		size:"sm",
		variant:buttonValues["restaurant"],
		style:{width:"10"},
		label:"Have Restaurant",
		btnFn: ()=>btnFn("restaurant","restaurant_service")
	}
	const disObj = {
		size:"sm",
		label:"Disability Service",
		variant:buttonValues["disability"],
		style:{width:"10"},
		btnFn: ()=>btnFn("disability","disabled_services")
	}

	const sleepObj = {
		size:"sm",
		label:"Can Sleep",
		variant:buttonValues["sleep"],
		style:{width:"10"},
		btnFn: ()=>btnFn("sleep","beds")
	}
	const bikeObj = {
		size:"sm",
		label:"Is bike Friendly",
		variant:buttonValues["bike"],
		style:{width:"10"},
		btnFn: ()=>btnFn("bike","bike_friendly")
	}

	const areaObj = {
		size:"sm",
		label:"Area",
		variant:buttonValues["area"],
		style:{width:"10"},
		btnFn: ()=>btnArea("area")
	}
	

	return <>
	<Row className="mt-5 mb-2" >
		<Col>
			<BtnFilter obj={restObj}/>
		</Col>
		
		<Col>
			<BtnFilter obj={disObj}/>
		</Col>
	</Row>
	<Row>
		<Col>
			<BtnFilter obj={sleepObj}/>
		</Col>
		
		<Col>
			<BtnFilter obj={bikeObj}/>
		</Col>
	</Row>

		<Col>
			<BtnFilter obj={areaObj}/>
		</Col>

		<Col>
			<Button variant="danger" onClick={resetFn}>
				Reset
			</Button>
		</Col>
	</>
}


function FilterMenu(props) {
	const [cities, setCities] = useState();
	const [provinces, setProvinces] = useState();
	const [showModal, setShowModal] = useState(false);

	//console.log(props);
	const optionsReach = {
		label:"Reachability",
		eventKey:"1",
		loadFilter:props.loadFilter,
		options:[{label:"normal",filterOption:"normal"},
		{label:"offroad",filterOption:"offroad"},
		{label:"foot",filterOption:"foot"},
		{label:"cable",filterOption:"cable"}],
		filter:"reach"
	}
	const optionsAlt = {
		label:"Altitude",
		eventKey:"2",
		loadFilter:props.loadFilter,
		options:[{label:"Less than 1000 m",filterOption:"0,1000"},
		{label:"Between 1000 m and 1300 m",filterOption:"1001,1300"},
		{label:"Between 1300 m and 1800 m",filterOption:"1301,1800"},
		{label:"More than 1800 m",filterOption:"1801,100000"}
	],
		filter:"altitude"
	}


	const objProv = {
        label:"Province",
        filter:"province",
        eventKey:"3",
        loadFilter:props.loadFilter
    };

	const objCity = {
        label:"City",
        filter:"city",
        eventKey:"4",
        loadFilter:props.loadFilter
    };


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
			<Row className="mt-3 mb-1 ms-1 me-1">
				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Filtering options</Accordion.Header>
						<Accordion.Body>
							<Accordion>
								
								<Row>
									<Col>
										<AccordionFilter obj={optionsReach}/>
										<AccordionFilter obj={optionsAlt}/>
									</Col>

									<Col>

										<AccordionGeo obj={objProv} cities={provinces}/>
											
										<AccordionGeo obj={objCity} cities={cities}/>
											
									</Col>
								</Row>
								
								<FilterMenuBtn obj={{loadFilter:props.loadFilter,setShowModal}}/>

							</Accordion>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Row>

			{showModal && <MapModal 
			obj={{showModal,setShowModal,areadragmap:true,loadFilter:props.loadByArea}} />}

		</>
	);
}




export default HutList;



/*
<Row>
									<Col>
										<Button
											size="sm"
											variant={buttonValues["area"]}
											onClick={() => {
												setSelected("area");
												setShowModal(true);
											}}
										>
											Area
										</Button>
									</Col>
									<Col>
										<Button
											variant="danger"
											onClick={() => {
												props.loadFilter("none");
												setSelected("");
											}}
										>
											Reset
										</Button>
									</Col>
								</Row>

<Row className="mt-5 mb-2" >
									<Col>
										<Button
											size="sm"
											style={{ width: "10" }}
											variant={buttonValues["restaurant"]}
											onClick={() => {
												setSelected("restaurant");
												props.loadFilter("restaurant_service");
											}}
										>
											Have Restaurant
										</Button>
									</Col>
									<Col>
										<Button
											size="sm"
											variant={buttonValues["disability"]}
											onClick={() => {
												setSelected("disability");
												props.loadFilter("disabled_services");
											}}
										>
											Disability Service
										</Button>
									</Col>
								</Row>
								<Row>
									<Col>
										<Button
											size="sm"
											variant={buttonValues["sleep"]}
											onClick={() => {
												setSelected("sleep");
												props.loadFilter("beds");
											}}
										>
											Can Sleep
										</Button>
									</Col>
									<Col>
										<Button
											size="sm"
											variant={buttonValues["bike"]}
											onClick={() => {
												setSelected("bike");
												props.loadFilter("bike_friendly");
											}}
										>
											Is bike Friendly
										</Button>
									</Col>
								</Row>
*/


/*

<Accordion.Item eventKey="2" className="w-100">
											<Accordion.Header>Reachability</Accordion.Header>
											<Accordion.Body>
												<ListGroup variant="flush">
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() =>
															props.loadFilter("reach", "normal")
														}
													>
														normal
													</ListGroup.Item>
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() =>
															props.loadFilter("reach", "offroad")
														}
													>
														offroad
													</ListGroup.Item>
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() => props.loadFilter("reach", "foot")}
													>
														foot
													</ListGroup.Item>
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() => props.loadFilter("reach", "cable")}
													>
														cable
													</ListGroup.Item>
												</ListGroup>
											</Accordion.Body>
										</Accordion.Item>



										<Accordion.Item eventKey="4" className="w-100">
											<Accordion.Header>Altitude</Accordion.Header>
											<Accordion.Body>
												<ListGroup variant="flush">
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() => props.loadFilter("altitude", "0,1000")}
													>
														Less than 1000 m
													</ListGroup.Item>
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() =>
															props.loadFilter("altitude", "1001,1300")
														}
													>
														Between 1000 m and 1300 m
													</ListGroup.Item>
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() =>
															props.loadFilter("altitude", "1301,1800")
														}
													>
														Between 1300 m and 1800 m
													</ListGroup.Item>
													<ListGroup.Item
														id="smallgroups"
														action={true}
														onClick={() =>
															props.loadFilter("altitude", "1801,100000")
														}
													>
														More than 1800 m
													</ListGroup.Item>
												</ListGroup>
											</Accordion.Body>
										</Accordion.Item>

<Accordion.Item
											eventKey="5"
											onClick={() => loadList("province")}
											className="w-100"
										>
											<Accordion.Header>Province</Accordion.Header>
											<Accordion.Body>
												<ListGroup variant="flush">
													{provinces &&
														provinces.map(({ province }) => (
															<ListGroup.Item
																key={province}
																id="smallgroups"
																action={true}
																onClick={() =>
																	props.loadFilter("province", province)
																}
															>
																{province}
															</ListGroup.Item>
														))}
												</ListGroup>
											</Accordion.Body>
										</Accordion.Item>
					
										<Accordion.Item
											eventKey="6"
											onClick={() => loadList("city")}
											className="w-100"
										>
											<Accordion.Header>City</Accordion.Header>
											<Accordion.Body>
												<ListGroup variant="flush">
													{cities &&
														cities.map(({ city }) => (
															<ListGroup.Item
																key={city}
																id="smallgroups"
																action={true}
																onClick={() => props.loadFilter("city", city)}
															>
																{city}
															</ListGroup.Item>
														))}
												</ListGroup>
											</Accordion.Body>
										</Accordion.Item>
*/