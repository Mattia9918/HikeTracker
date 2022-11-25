//import { Container, Card, Row, Col, Form, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {MapContainer,TileLayer,Marker,GeoJSON, Rectangle} from 'react-leaflet'; 
import {useMap,useMapEvents} from 'react-leaflet/hooks';
import APIGpx from '../../API/APIGpx';
import "leaflet-area-select";

//props = hikeid | stati = coordinates,(first/last)Point,center
const MapItem = (props)=>{

    const [coordinates, setCoordinates] = useState({});
    const [firstPoint, setFirstPoint] = useState([]);
    const [lastPoint, setLastPoint] = useState([]);
    const [center, setCenter] = useState([]);
 

    useEffect(() => {
        const getJson = async()=>{
            try {
                    const json = await APIGpx.getFileById(props.hikeid);
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
    }, [props.hikeid]);


    return <>
        {coordinates.length &&
            <center>
                <MapContainer style={{ height: "500px", width: "770px"}} center={center} zoom={12} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <GeoJSON data={coordinates} />
                    {(props.dynamicmarker &&
                        <CreateMarker latlng = {props.latlng} setLatlng = {props.setLatlng} />)
                    }
                    <Marker position={firstPoint}></Marker>
                    <Marker position={lastPoint}></Marker>
                </MapContainer>
            </center>
        }
    </>;
}

function CreateMarker(props) {
    const map = useMapEvents({
      click:(ev)=>{
        const coord = ev.latlng;
        props.setLatlng(coord); 
        console.log(coord); 
      }
    }); 
  
    return <>
    {props.latlng.length!==0 ? <Marker position={props.latlng}></Marker>:false}
    </>
  }

  const AreaDragMap = (props)=>{
    return <>
            <center>
                <MapContainer style={{ height: "500px", width: "770px"}} center = {{lat: 44.763765, lng: 10.929165}} zoom={5} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <AreaSelect bounds = {props.bounds} setBounds = {props.setBounds}/>
                </MapContainer>
            </center>
    </>;
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

export {MapItem, AreaDragMap}; 

