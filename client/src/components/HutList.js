import {
	Container,
	Card,
	Row,
	Col,
	Button,
	Badge,
	Accordion,
	ListGroup,
	Modal
} from "react-bootstrap";
import { useState, useEffect } from "react";
import APIHikes from "../API/APIHikes";
import API from '../API/APIGpx';
import { useMap, useMapEvents } from 'react-leaflet/hooks';
import "leaflet-area-select";
import { MapContainer, TileLayer, Marker, GeoJSON, Popup, Circle, Rectangle } from 'react-leaflet';
import { BsCheckCircle } from "react-icons/bs";
import { MapModal } from "./Hikes";


function HutList(props) {
	const halfArray = Math.ceil(props.huts.length / 2);
	const leftArray = props.huts.slice(0, halfArray);
	const rightArray = props.huts.slice(halfArray);

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
	const [open, setOpen] = useState(false);

	return (
		<Container className="mt-3 mb-3">
			<Card className="shadow-sm p-2">
				{/* -- CARD HEADER -- */}
				<Card.Header>
					<Row>
						<Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6}>
							<b>
								{props.Hut.name}, {props.Hut.province} , {props.Hut.city}
							</b>
						</Col>

						<Col align="right">
							<Badge bg={"success"}>Available</Badge>
						</Col>
					</Row>
				</Card.Header>
				<Card.Img
					className="mt-2"
					variant="top"
					src={
						(props.Hut.reachability === "normal" &&
							"http://localhost:3000/nicehut.jpg") ||
						(props.Hut.reachability === "offroad" &&
							"http://localhost:3000/huttra.jpg") ||
						(props.Hut.reachability === "foot" &&
							"http://localhost:3000/rifugetto.jpg") ||
						(props.Hut.reachability === "cable" &&
							"http://localhost:3000/rifugiobello.jpg") ||
						"http://localhost:3000/hutbike.jpg"
					}
				/>

				{/* -- CARD BODY -- */}
				<Card.Body>
					<Card.Title>{props.Hut.address}</Card.Title>
					<Card.Text>
						<ul>
							<li>
								<b>Phone number:</b> {props.Hut.phone_number}
							</li>
							<li>
								<b>Email:</b> {props.Hut.email}
							</li>
							<li>
								<b>Web Site:</b> {props.Hut.web_site}
							</li>
						</ul>
						<br></br>
						{!open && (
							<Button variant="link" onClick={() => setOpen(true)}>
								Show more{" "}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-chevron-down"
									viewBox="0 0 16 16"
								>
									<path
										fill-rule="evenodd"
										d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
									/>
								</svg>
							</Button>
						)}
						{open && (
							<>
								<br></br>
								<br></br>
								<b>Details:</b>
								<br></br>
								<ul className="mt-2">
									<li>
										<b>Description:</b> {props.Hut.description}
									</li>
									<li>
										<b>Altitude:</b> {props.Hut.altitude}
									</li>
									<li>
										<b>Languages:</b> {capitalizeFirstLetter(props.Hut.languages)}
									</li>
									<li>
										<b>Bathrooms:</b> {props.Hut.bathrooms}
									</li>
									<li>
										<b>Bedrooms:</b> {props.Hut.beds}
									</li>
									{props.Hut.bike_friendly !== 0 && (
										<li>
											<b>Bike friendly <BsCheckCircle style={{ "color": "green" }} /></b>
										</li>
									)}
									{props.Hut.resturant_service !== 0 && (
										<li>
											<b>Resturant service <BsCheckCircle style={{ "color": "green" }} /></b>
										</li>
									)}
									{props.Hut.disabled_services !== 0 && (
										<li>
											<b>Disabled services <BsCheckCircle style={{ "color": "green" }} /></b>
										</li>
									)}
								</ul>
								<Button variant="link" onClick={() => setOpen(false)}>
									Show less{" "}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										class="bi bi-chevron-up"
										viewBox="0 0 16 16"
									>
										<path
											fill-rule="evenodd"
											d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
										/>
									</svg>
								</Button>
							</>
						)}
					</Card.Text>
				</Card.Body>
			</Card>
		</Container>
	);
}

function FilterMenu(props) {
	const [cities, setCities] = useState();
	const [provinces, setProvinces] = useState();
	const [selected, setSelected] = useState("");
	const [showModal, setShowModal] = useState(false);

	const buttonValues = [];
	buttonValues["resturant"] = "outline-primary";
	buttonValues["disability"] = "outline-primary";
	buttonValues["sleep"] = "outline-primary";
	buttonValues["bike"] = "outline-primary";
	buttonValues["area"] = "outline-primary";

	buttonValues[selected] = "primary";

	async function loadList(type) {
		let citieslist;
		let provincelist;

		switch (type) {
			case "city":
				citieslist = await APIHikes.getHikeCities();
				setCities(citieslist);
				break;

			case "province":
				provincelist = await APIHikes.getHikeProvinces();
				setProvinces(provincelist);
				break;
		}
	}

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
									</Col>
									<Col>
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
									</Col>
								</Row>
								<Row className="mt-5 mb-2" >
									<Col>
										<Button
											size="sm"
											style={{ width: "10" }}
											variant={buttonValues["resturant"]}
											onClick={() => {
												setSelected("resturant");
												props.loadFilter("restaurant_service");
											}}
										>
											Have Resturant
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
							</Accordion>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Row>

			{showModal && <MapModal showModal={showModal} setShowModal={setShowModal} areadragmap={true} loadFilter={props.loadByArea} />}

		</>
	);
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


export default HutList;
