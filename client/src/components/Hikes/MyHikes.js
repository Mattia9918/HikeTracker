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

			setStarted(startedHike);

		} catch (err) {
			console.log(err);
		}
	}


	useEffect(() => {
		loadHikes();
		loadStarted();
	}, []);





	return (
		<>
			{started.length === 0 ? null :
				<Row>
					<center>
						<Col lg={8} xs={12}>


							{started.length === 0 ?
								null
								:
								<Container className="mt-3 shadow-sm p-2" id="cardscontainer">
											<h4 className="pt-3 text-success fw-bold">Hike in progress</h4>
											<HikeList hikes={started}></HikeList>
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
								<h4 className="pt-3">Completed hikes</h4>
							</Row>
									<Row>
										<Col>
										{hikes.length === 0 ?
										
												<h6 className = "mt-2">You did not completed any hike</h6> :
												<HikeList hikes={hikes}></HikeList>
										}
										</Col>
									</Row>
						</Container>
					</Col>

				</center>
			</Row>

		</>
	);
}

function HikeList(props) {
	return (
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
	console.log("adate", adate);
	console.log("prop", props.hikes.start);
	console.log("sdate", sdate);
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
						<h6 className="d-inline p-3 mb-2 float-end">Date: {sdate.getDate()}/{sdate.getMonth() + 1}/{sdate.getFullYear()}</h6>
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
									<p><b>Description:</b></p>
									<p>{props.hikes.start.hikeDescription}</p>
								</div>

							</Col>


						</Row>

						{props.hikes.start.end_time !== null ?
							<Row>
								<Col>

									<div className="m-2  p-2 fs-6">
										<p><b>Start time:</b> {sdate.getHours()}:{sdate.getUTCMinutes()}:{sdate.getSeconds()}</p>
										<p><b>End time:</b> {adate.getHours()}:{adate.getUTCMinutes()}:{adate.getSeconds()}</p>
										<p><b>Hike length:</b> {props.hikes.start.len} km </p>
										<p><b>Estimated Time:</b> {props.hikes.start.estimatedTime} hours</p>
									</div>

								</Col>
								<Col>
									<div className="m-2 p-2">
										<p><b>Difficulty: </b>
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
										<p><b>Hike completed in:</b>   </p>
										<p>{Math.floor(((diffDate) / (1000 * 60 * 60)) % 24)} hours {Math.floor(((diffDate) / (1000 * 60)) % 60)} minutes and {Math.floor(((diffDate) / (1000)) % 60)} seconds </p>

										<p><b>Average pace:</b> {(((props.hikes.start.len * 1000) / (Math.floor((diffDate) / (1000)))) * 3.6).toFixed(2)} km/h</p>
									</div>
								</Col>
								<Col>
									<div className="m-2 p-2">
										<p><b>Starting point:</b></p>
										<p><i> {props.hikes.start.city}, {props.hikes.start.province} </i></p>
										<p><b>Ending point:</b></p>
										<p><i> {props.hikes.end.city}, {props.hikes.end.province} </i></p>
									</div>
								</Col>
							</Row>

							:
							<Row>
								<Col>
									<div className="m-2  p-2 fs-6">
										<p><b>Start Time:</b> {sdate.getHours()}:{sdate.getUTCMinutes()}:{sdate.getSeconds()}</p>
										<p><b>Hike length:</b> {props.hikes.start.len} km </p>
										<p><b>Estimated time:</b> {props.hikes.start.estimatedTime} hours</p>
									</div>
								</Col>

								<Col>
									<div className="m-2 p-2">
										<p><b>Starting point:</b></p>
										<p><i> {props.hikes.start.city}, {props.hikes.start.province} </i></p>
										<p><b>Ending point:</b></p>
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