import {  Accordion, ListGroup } from 'react-bootstrap';

//Filter for length/time/difficulty/ascent | filter for altitude/reachability
const AccordionFilter = (props)=>{

    const {eventKey,options,label,filter} = props.obj; 
    


    return <>
        <Accordion.Item eventKey={eventKey}>
            <Accordion.Header>{label}</Accordion.Header>
            
            <Accordion.Body>
                
                <ListGroup variant = "flush">
                    {options.map(o=>
                        <ListGroup.Item  key={o.label+options.indexOf(o)} action={true} 
                        onClick={() => props.loadFilter(filter,o.filterOption)}
                        >
                        {o.label}
                    </ListGroup.Item>
                    )
                    }
                </ListGroup>

            </Accordion.Body>

        </Accordion.Item>
    </>; 
}

//Filter for province/city
const AccordionGeo = (props)=>{

    const {label,filter,eventKey} = props.obj; 
    const loadFilter = props.loadFilter;


    return <>
          <Accordion.Item eventKey={eventKey}>
            <Accordion.Header>{label}</Accordion.Header>
            {filter==="province" ? <Accordion.Body>
                <ListGroup variant = "flush">
                    {props.cities && props.cities.map(({province}) => {
                    return <ListGroup.Item key = {label+province}  
                                action = {true}
                                onClick={()=>loadFilter(filter,province)}
                                >
                                    {province}
                        </ListGroup.Item>})}


                </ListGroup>
            </Accordion.Body>:false}

            {filter==="city" ? <Accordion.Body>
                <ListGroup variant = "flush">
                    {props.cities && props.cities.map(({city}) => {
                        //console.log(city);
                        return <ListGroup.Item key = {label+city}  
                                action = {true} 
                                onClick={()=>loadFilter(filter,city)}
                                >
                                    {city}
                        </ListGroup.Item>})}


                </ListGroup>
            </Accordion.Body>:false}

        </Accordion.Item>
    </>; 
}



export {AccordionFilter,AccordionGeo}; 

