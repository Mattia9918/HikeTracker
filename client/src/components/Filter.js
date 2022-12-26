import { useState } from "react";
import { Accordion, ListGroup } from "react-bootstrap";

//Filter for length/time/difficulty/ascent | filter for altitude/reachability
const AccordionFilter = (props) => {
	const { eventKey, options, label, filter } = props.obj;

	return (
		<>
			<Accordion.Item eventKey={eventKey}>
				<Accordion.Header>{label}</Accordion.Header>

				<Accordion.Body>
					<ListGroup variant="flush">
						{options.map((o) => (
							<ListGroupItem
								key={o.label + options.indexOf(o)}
								option={o}
								options={options}
								filterVector={props.filterVector}
								filter={filter}
								loadFilter={props.loadFilter}
								removeElementFilterVector={
									props.removeElementFilterVector
								}
							/>
						))}
					</ListGroup>
				</Accordion.Body>
			</Accordion.Item>
		</>
	);
};

const ListGroupItem = (props) => {
	const [clicked, setClicked] = useState(false);
	return (
		<ListGroup.Item
			action={true}
			onClick={() => {
				console.log(props.filterVector);
				console.log(clicked);
				if (!clicked) {
					setClicked(true);
					console.log("PUSHING");
					const [fv1, fv2] = props.option.filterOption.split(",");
					const newElement = {
						filterName: props.filter,
						value1: fv1,
						value2: fv2,
					};
					// props.filterVector = props.filterVector.filter(
					// 	(filt) => filt.filterName !== props.filter
					// );
					props.removeElementFilterVector(props.filter);
					props.filterVector.push(newElement);
					console.log(props.filterVector);
				} else {
					setClicked(false);

					props.removeElementFilterVector(props.filter);
				}
				props.loadFilter(props.filterVector);
				console.log(props.filterVector);
			}}
		>
			{props.option.label}
		</ListGroup.Item>
	);
};

//Filter for province/city
const AccordionGeo = (props) => {
	const { label, filter, eventKey } = props.obj;
	const loadFilter = props.loadFilter;

	return (
		<>
			<Accordion.Item eventKey={eventKey}>
				<Accordion.Header>{label}</Accordion.Header>
				{filter === "province" ? (
					<Accordion.Body>
						<ListGroup variant="flush">
							{props.cities &&
								props.cities.map(({ province }) => {
									return (
										<ListGroup.Item
											key={label + province}
											action={true}
											onClick={() =>
												loadFilter(filter, province)
											}
										>
											{province}
										</ListGroup.Item>
									);
								})}
						</ListGroup>
					</Accordion.Body>
				) : (
					false
				)}

				{filter === "city" ? (
					<Accordion.Body>
						<ListGroup variant="flush">
							{props.cities &&
								props.cities.map(({ city }) => {
									return (
										<ListGroup.Item
											key={label + city}
											action={true}
											onClick={() =>
												loadFilter(filter, city)
											}
										>
											{city}
										</ListGroup.Item>
									);
								})}
						</ListGroup>
					</Accordion.Body>
				) : (
					false
				)}
			</Accordion.Item>
		</>
	);
};

export { AccordionFilter, AccordionGeo };
