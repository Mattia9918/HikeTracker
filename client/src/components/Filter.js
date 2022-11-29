import {  Row, Col, Button, Accordion, ListGroup } from 'react-bootstrap';
import { useState,useEffect } from 'react';
import APIHikes from '../API/APIHikes';


import {MapModal} from './Map/Maps';

//Filter for length/time/difficulty/ascent | filter for altitude/reachability
const AccordionFilter = (props)=>{

    //onClick={() => loadFilter(filter,o.filterOption)}
    const {eventKey,options,label,filter} = props.obj; 
    
    console.log("AccordionFilter"); 
    console.log(props);
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



/*
    const length = {eventKey:"1",options:[{
        label:"Between 0 and 10 km",
        filterOption:"0,10"
    },{
        label:"Between 10 and 20 km",
        filterOption:"11,20"
    },{
        label:"More than 20 km",
        filterOption:"21,1000"
    }
],
    label:"Length",filter:"length",loadFilter:props.loadFilter}; 


    const time = {eventKey:"2",options:[{
        label:"Less than 1 hour",
        filterOption:"0,1"
    },{
        label:"Between 1 and 2 hour",
        filterOption:"1,2"
    },{
        label:"Between 2 and 3 hour",
        filterOption:"2,3"
    },{
        label:"More than 3 hour",
        filterOption:"3,1000"
    }
],
    label:"Estimated Time",filter:"expectedTime",loadFilter:props.loadFilter}; 

    const difficulty = {eventKey:"3",options:[{
        label:"Easy",
        filterOption:"Easy"
    },{
        label:"Average",
        filterOption:"Average"
    },{
        label:"Difficult",
        filterOption:"Difficult"
    }
],
    label:"Difficulty",filter:"difficulty",loadFilter:props.loadFilter}; 

    const ascent = {eventKey:"4",options:[{
        label:"Steep descent (more than -100m)",
        filterOption:"-10000,-101"
    },{
        label:"Small descent (less than -100m)",
        filterOption:"-100,-1"
    },{
        label:" Small ascent (Less than 100 m)",
        filterOption:"0,100"
    },{
        label:"Decent ascent (between 100 m and 300 m)",
        filterOption:"101,300"
    },{
        label:"Steep ascent (Between 300 m and 600 m)",
        filterOption:"301,600"
    },
    {
        label:"Climbing (more than 600 m)",
        filterOption:"601,100000"
    }
],
    label:"Ascent",filter:"ascent",loadFilter:props.loadFilter}; 

    
    const objProv = {
        label:"Province",
        filter:"province",
        eventKey:"5",
        loadFilter:props.loadFilter
    };

    const objCity = {
        label:"City",
        filter:"city",
        eventKey:"6",
        loadFilter:props.loadFilter
    };
    */
