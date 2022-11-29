import {Container,Card,Row,Col, Button, Accordion,ButtonGroup} from "react-bootstrap";
import {  useState,useEffect } from 'react';
import "leaflet-area-select";
import {CardImg,CardHeader,VisibleInfo,Details} from './HutComp';

import APIHuts from '../../API/APIHutGet';
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
	<ButtonGroup className="w-100 mt-5">
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
		{filters.map(f=>{
					return <AccordionFilter 
					key={"filterHut"+filters.indexOf(f)} 
					obj={f.option}
					loadFilter={loadFilter}
					/>
						
				})
		}	
	</Accordion>

	{/*Filter for PROVINCE & CITIES*/}
	<Accordion>
		{filtersGeo.map(f=>{
			return <AccordionGeo 
				key={"filterGeo"+filtersGeo.indexOf(f)}
				obj={f.option} 
				cities={f.option.label==="Province"?provinces:cities}
				loadFilter={loadFilter}
			/>
		})}
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
				<Col> 
					<BtnFilterHut loadByArea={loadByArea} loadFilter={loadHutFilter}/>
					<AccordionFilterHut obj={{cities,provinces,loadFilter:loadHutFilter}}/>
				</Col>
				
				<Col lg={8} xs={12}>
					<Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
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
				
			</Row>

		</>
	);
}









export default HutList;


//import {AccordionFilter,AccordionGeo} from '../Filter'; 
//import APIHikes from '../../API/APIHikes';
//import {Button,Accordion} from 'react-bootstrap'; 
//import { MapModal } from "../Map/Maps";



//<FilterMenu loadFilter={props.loadHutsFilter} loadByArea={props.loadByArea} />
	
/*
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
	
		loadFilter(filter);
	}
	const btnArea = (filter)=>{

		setShowModal(true); 
	}
	const resetFn = ()=>{
		loadFilter("none");
		setSelected("");
	}



*/