import {Container,Card,Row,Col, Button, Accordion,ButtonGroup} from "react-bootstrap";
import {  useState,useEffect } from 'react';
import "leaflet-area-select";

import APIHuts from '../../API/APIHutGet';

import {CardImg,CardHeader,VisibleItem,HiddenItem} from './HutComp';

import { AccordionFilter, AccordionGeo } from "../Filter";

import {GrPowerReset} from 'react-icons/gr';
import {BsMap} from 'react-icons/bs';
import {IoMdRestaurant} from 'react-icons/io';
import {FaBed} from 'react-icons/fa';
import {TbDisabled} from 'react-icons/tb'
import {MdDirectionsBike} from 'react-icons/md'

import {filters,filtersGeo} from './HutsFilterOption'; 

import {MapModal} from '../Map/Maps'; 


//Filter for restaurant/disabled_service/sleep/bike/map/reset
const BtnFilterHut = (props)=>{

	const loadFilter = props.loadFilter;
	const [showModal,setShowModal] = useState(false); 


	return <>

	{showModal && <MapModal 
            obj={{showModal,setShowModal,areadragmap:true,loadFilter:props.loadByArea}}/>}


	{/*Reset | Map */}
	<ButtonGroup className="w-100">
		<Button size="sm" variant="danger"  onClick={()=>loadFilter("none")}>
			<GrPowerReset/>{" "}Reset
		</Button>
	
		<Button size="sm" variant="primary"  onClick={()=>setShowModal(true)}>
			<BsMap/>{" "}Map
		</Button>
	</ButtonGroup>
	
	{/*Restaurnt | Disability | Sleep | Bike */}
	<ButtonGroup className="w-100 ">
					
		<Button size="sm" variant="secondary"  onClick={()=>loadFilter("restaurant_service","restaurant")}>
			<IoMdRestaurant/>{" "}Restaurant
		</Button>
						
		<Button size="sm" variant="secondary"  onClick={()=>loadFilter("disabled_services","disability")}>
			<TbDisabled/>{" "}Disability
		</Button>

		<Button size="sm" variant="secondary"  onClick={()=>loadFilter("beds","sleep")}>
			<FaBed/>{" "}Sleep
		</Button>
		
		<Button size="sm" variant="secondary"  onClick={()=>loadFilter("bike_friendly","bike")}>
			<MdDirectionsBike/>{" "}Bike
		</Button>

	</ButtonGroup>
	

	</>
}

//Filter for province/city/altitude/reachability
const AccordionFilterHut = (props)=>{

	const {cities,provinces,loadFilter} = props.obj;

	return <>
	
	{/*Filter for ALTITUDE & REACHABILITY*/}
	<Accordion className="mb-2 mt-2">
		<Row>
				{filters.map(f=>{
							return <>
								<Col >
									<AccordionFilter 
										key={"filterHut"+filters.indexOf(f)} 
										obj={f.option}
										loadFilter={loadFilter}
										/>
								</Col>
							</>
	
						})
				}

		</Row>
	</Accordion>

	{/*Filter for PROVINCE & CITIES*/}
	<Accordion>
		<Row>
			{filtersGeo.map(f=>{
				return <>
					<Col >
						<AccordionGeo 
							key={"filterGeo"+filtersGeo.indexOf(f)}
							obj={f.option} 
							cities={f.option.label==="Province"?provinces:cities}
							loadFilter={loadFilter}
						/>
					</Col>
				</>
			})}
		</Row>
	</Accordion>
	</>;


	/*
	
	
	*/
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
				
				<Card.Title>{address}</Card.Title>
					
				<CardImg reachability={reachability}/>

				{/* -- CARD BODY -- */}
				<Card.Body>
					
					<Card.Text>
						<VisibleItem obj={{phone_number,email,web_site}}/>
					</Card.Text>

				</Card.Body>

				<HiddenItem obj={objDetails}/>
			</Card>
		</Container>
	);
}

function HutList(props) {

	const [huts,setHuts] = useState([]); 
	const [cities, setCities] = useState();
	const [provinces, setProvinces] = useState();
	
	
    const leftArray = huts.filter(v=>huts.indexOf(v)<huts.length/2); 
    const rightArray = huts.filter(v=>huts.indexOf(v)>=huts.length/2); 			
	
	async function loadHuts() {
		try {
		  const hutList = await APIHuts.getHuts();
		  setHuts(hutList);
		} catch (err) {}
	  };
	
	async function loadList() {

		const citieslist = await APIHuts.getHutCities();
		setCities(citieslist);
	
		 
		const provincelist = await APIHuts.getHutProvinces();
		setProvinces(provincelist);

	}

	async function loadHutFilter(filter, value) {
		try {
	
			const filteredHutList = await APIHuts.getFilter(filter, value);
			
			setHuts(filteredHutList);
		} 
		catch (err) {}

	  };

	async function loadByArea(filter, value) {
		try {
		  const filteredHutList = await APIHuts.getHutFilter(filter, value);
		  setHuts(filteredHutList);
	
		} catch (err) {}
	  }

	useEffect(() => {
		loadHuts();
		loadList();
		}, []);

	
	return (
		<>
			<Row>

				<center>
				<Col lg={8} xs={12}>
					<Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
						
						<Row className="mt-3 mb-1 ms-1 me-1">
							<Accordion >
								<Accordion.Item eventKey={1}>
								
									<Accordion.Header>Filtering options</Accordion.Header>
						
									<Accordion.Body>
										<BtnFilterHut loadByArea={loadByArea} loadFilter={loadHutFilter}/>
										<AccordionFilterHut obj={{cities,provinces,loadFilter:loadHutFilter}}/>
									</Accordion.Body>
							
								</Accordion.Item>
							</Accordion>
						</Row>

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
				</center>
			</Row>

		</>
	);
}

export default HutList;
