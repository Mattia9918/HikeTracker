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
					let newElement;
					let fv = [];

					if (props.isGeo === true) {
						newElement = {
							filterName: props.filter,
							value1: props.filterValue,
						};
					} else {
						fv = props.option.filterOption.split(",");
						newElement = {
							filterName: props.filter,
							value1: fv[0],
							value2: fv[1],
						};
					}
					props.removeElementFilterVector(props.filter);
					props.filterVector.push(newElement);
					console.log(props.filterVector);
				} else {
					setClicked(false);

					props.removeElementFilterVector(props.filter);
				}
				props.loadFilter(props.filterVector);
				console.log(props.filterVector);
			}}>
			{!props.isGeo && props.option.label}
			{props.isGeo && props.filterValue}
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
								props.cities.map((province) => {
									return <ListGroupItem
										key={label + province.province}
										filterValue={province.province}
										filterVector={props.filterVector}
										filter={filter}
										loadFilter={loadFilter}
										removeElementFilterVector={props.removeElementFilterVector}
										isGeo={true}
									/>;
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
								props.cities.map((city) => {
									return <ListGroupItem
										key={label + city.city}
										filterValue={city.city}
										filterVector={props.filterVector}
										filter={filter}
										loadFilter={loadFilter}
										removeElementFilterVector={props.removeElementFilterVector}
										isGeo={true}
									/>;
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
