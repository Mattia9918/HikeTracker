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
import {useMap,useMapEvents} from 'react-leaflet/hooks';
import "leaflet-area-select";
import {MapContainer,TileLayer,Marker,GeoJSON,Popup,Circle, Rectangle} from 'react-leaflet';
function HutList(props) {
	const halfArray = Math.ceil(props.huts.length / 2);
	const leftArray = props.huts.slice(0, halfArray);
	const rightArray = props.huts.slice(halfArray);

	return (
		<>
			<Container>
				<Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
					<FilterMenu loadFilter={props.loadHutsFilter} loadByArea={props.loadByArea}/>
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
			</Container>
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
						(props.Hut.reachability === "With normal car" &&
							"http://localhost:3000/nicehut.jpg") ||
						(props.Hut.reachability === "With off-road car" &&
							"http://localhost:3000/huttra.jpg") ||
						(props.Hut.reachability === "On foot" &&
							"http://localhost:3000/rifugetto.jpg") ||
						(props.Hut.reachability === "Cableway" &&
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
							<a onClick={() => setOpen(true)}>
								{" "}
								SHOWMORE{" "}
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
							</a>
						)}
						{open && (
							<a onClick={() => setOpen(false)}>
								{" "}
								SHOWLESS{" "}
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
							</a>
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
										<b>Languages:</b> {props.Hut.languages}
									</li>
									<li>
										<b>Bathrooms:</b> {props.Hut.bathrooms}
									</li>
									<li>
										<b>Bedrooms:</b> {props.Hut.bedrooms}
									</li>
									{props.Hut.bike_friendly && (
										<li>
											<b>The place is Bike Friendly</b>{" "}
										</li>
									)}
									{props.Hut.resturant_service && (
										<li>
											<b>Has a Resturant Service</b>
										</li>
									)}
								</ul>
								<a onClick={() => setOpen(false)}>
									{" "}
									SHOWLESS{" "}
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
								</a>
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
    const [bounds, setBounds] = useState([]);

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
									<Accordion.Item eventKey="2" id="secondaryaccordion" className="w-100">
										<Accordion.Header>Reachability</Accordion.Header>
										<Accordion.Body>
											<ListGroup variant="flush">
												<ListGroup.Item
													id="smallgroups"
													action={true}
													onClick={() =>
														props.loadFilter("reach", "With normal car")
													}
												>
													With normal car
												</ListGroup.Item>
												<ListGroup.Item
													id="smallgroups"
													action={true}
													onClick={() =>
														props.loadFilter("reach", "With off-road car")
													}
												>
													With off-road car
												</ListGroup.Item>
												<ListGroup.Item
													id="smallgroups"
													action={true}
													onClick={() => props.loadFilter("reach", "On foot")}
												>
													On foot
												</ListGroup.Item>
												<ListGroup.Item
													id="smallgroups"
													action={true}
													onClick={() => props.loadFilter("reach", "Cableway")}
												>
													Cableway
												</ListGroup.Item>
											</ListGroup>
										</Accordion.Body>
									</Accordion.Item>
								</Col>

								<Col>
									<Accordion.Item eventKey="4" id="secondaryaccordion" className="w-100">
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
							</Row>

							<Row>
								<Col>
									<Accordion.Item
										eventKey="5"
										id="secondaryaccordion"
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
								</Col>
								<Col>
									<Accordion.Item
										eventKey="6"
										id="secondaryaccordion"
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
                                            props.loadByArea("area")

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
         {showModal && <MapModal2 showModal={showModal} setShowModal={setShowModal} title={"TITLE"} hikeid={2} bounds={bounds} setBounds={setBounds} loadByArea={props.loadByArea}/>}
        </>
	);
}

function AreaSelect(props) {
    const map = useMap();
  
    useEffect(() => {
      if (!map.selectArea) return;
  
      map.selectArea.enable();
  
      map.on("areaselected", (e) => {
        props.setBounds(e.bounds)
        console.log(e.bounds);
      });
  
      // You can restrict selection area like this:
      const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
      // check restricted area on start and move
      map.selectArea.setValidate((layerPoint) => {
        return bounds.contains(this._map.layerPointToLatLng(layerPoint));
      });
  
      // now switch it off
      map.selectArea.setValidate();
    }, []);
  
    if (props.bounds.length!==0)
    return <Rectangle bounds={props.bounds} />
  
    return null;
  }

  function MapModal2(props) {

    /* -- STATES MANAGEMENT -- */

    const [coordinates, setCoordinates] = useState({});
    const [firstPoint, setFirstPoint] = useState([]);
    const [lastPoint, setLastPoint] = useState([]);
    const [center, setCenter] = useState([]);

    useEffect(() => {
        const getJson = async () => {
            try {
                const json = await API.getFileById(props.hikeid);
                const c = json.features;

                setCoordinates(c);

                const arrayCoordinates = c[0].geometry.coordinates;
                const last = arrayCoordinates.length - 1;
                const middle = Math.round(last / 2);

                const firstPoint = [arrayCoordinates[0][1], arrayCoordinates[0][0]];
                const center = [arrayCoordinates[middle][1], arrayCoordinates[middle][0]];
                const lastPoint = [arrayCoordinates[last][1], arrayCoordinates[last][0]];

                setFirstPoint(firstPoint);
                setCenter(center);
                setLastPoint(lastPoint);


            } catch (err) { }
        };
        getJson();
    }, []);

    /* -- RENDERING -- */
    return (
        <Modal size="lg" show={props.showModal} onHide={() => props.setShowModal(false)}>

            {/* Modal header */}
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>


            {/* Modal body */}
            <Modal.Body id="mapcontainer">
                {coordinates.length &&
                    <center>
                        <MapContainer style={{ height: "500px", width: "770px" }} center={center} zoom={12} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <GeoJSON data={coordinates} />
                            <AreaSelect bounds={props.bounds} setBounds={props.setBounds}/>
                            <Marker position={firstPoint}></Marker>
                            <Marker position={lastPoint}></Marker>
                        </MapContainer>
                    </center>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    props.setShowModal(false);
                    props.loadByArea("area", `${props.bounds._northEast.lat},${props.bounds._northEast.lng},${props.bounds._southWest.lat},${props.bounds._southWest.lng}`);
                    }}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};


export default HutList;
