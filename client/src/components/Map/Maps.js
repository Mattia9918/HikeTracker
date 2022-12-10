import { useEffect, useState } from 'react';
import {MapContainer,TileLayer,Marker,GeoJSON, Rectangle,Popup} from 'react-leaflet'; 
import {useMap,useMapEvents} from 'react-leaflet/hooks';
import {Modal,Button,Accordion,Row,Col} from 'react-bootstrap'; 
import "leaflet-area-select";
import L from 'leaflet';
import APIGpx from '../../API/APIGpx';

const MapItem = (props)=>{
    
    const [coordinates, setCoordinates] = useState({});
    const [firstPoint, setFirstPoint] = useState([]);
    const [lastPoint, setLastPoint] = useState([]);
    const [center, setCenter] = useState([]);
    const [start,setStart] = useState([]); 
    const [arrive,setArrive] = useState([]); 
    
 

    useEffect(() => {
        const getJson = async ()=>{
            try {
                    const json = await APIGpx.getFileById(props.hikeid);
                    const point = await APIGpx.getPointByHikeId(props.hikeid); 
                  
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

                    setStart([point[1].latitude,point[1].longitude]); 
                    setArrive([point[0].latitude,point[0].longitude]);


            } catch (err) { }
        };
        getJson();
      
        // eslint-disable-next-line
    }, []);

    return <>
        {coordinates.length &&
            <center>
                <MapContainer style={{ height: "500px", width: "770px"}} center={center} zoom={12} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <GeoJSON data={coordinates} />
                    
                    
                    <Marker position={start} icon={GetCustomIcon("starting")} >
                      <Popup>Starting Point</Popup>
                    </Marker>

                    <Marker position={arrive} icon={GetCustomIcon("ending")} >
                      <Popup>Starting Point</Popup>
                    </Marker>
                    
                    
                    { (start[0]!==firstPoint[0] && start[1]!==firstPoint[1]) && 
                      <Marker position={firstPoint}  >
                      </Marker>
                    }

                    { (arrive[0]!==lastPoint[0] && arrive[1]!==lastPoint[1]) && 
                      <Marker position={lastPoint}>
                      </Marker>
                    }
                    
                </MapContainer>
            </center>
        }
    </>;
}

const MarkerMap = (props)=>{
  
  return <>
          <center>
            <MapContainer style={{ height: "500px", width: "770px"}} center = {{lat: 44.763765, lng: 10.929165}} zoom={5} scrollWheelZoom={true}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <CustomMarker latlng = {props.latlng} setLatlng = {props.setLatlng} pos={props.pos} type = {props.type} />
            </MapContainer>
          </center>
  </>;
}

function CustomMarker(props) {
  
  const markerMap = useMapEvents({
    click:(ev)=>{
      const coord = ev.latlng;
      props.setLatlng(coord); 
    }
  }); 

  const type = props.type;
  
    return <>
    {props.latlng.length!==0 ? <Marker position={props.latlng} icon={GetCustomIcon(type)}></Marker>:false}
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


function MapModal(props) {
  
  const [latlng,setLatlng] = useState([]); 
  const [bounds,setBounds] = useState([]);
  
  const {showModal,setShowModal,areadragmap,markermap,title,
  setLatitude,setLongitude,onClickButton,hikeid,loadFilter
  } = props.obj;


  const handleContinue = (flag) => {
      if(flag==="continue"){ 
          setLatitude(latlng.lat); 
          setLongitude(latlng.lng);
          onClickButton(latlng.lat, latlng.lng);
          setShowModal(false); 
      }
      else { 
        onClickButton(undefined, undefined);
        setShowModal(false);
        
      }
  }

  /* -- RENDERING -- */
  return (
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>

          {/* Modal header */}
          <Modal.Header closeButton>
              
              <Modal.Title>{
                  (areadragmap && "Filter by geographic area") || 
                  (markermap && "Click to add a pointer on a location") ||
                                title
                  }
              </Modal.Title>
          
          </Modal.Header>

          {/* Modal body */}
          <Modal.Body >
              {areadragmap && <div className = "mb-3">Press ctrl + mouse drag to define a geographic area where you want to find hikes</div>}
              
              <Legenda />
              
              {(areadragmap &&
                  <AreaDragMap mode = {2} bounds = {bounds} setBounds = {setBounds} />) ||
                (markermap && 
                  <MarkerMap latlng = {latlng} setLatlng = {setLatlng} iconmode = {props.iconmode} type = {props.type}/>) ||
                  <MapItem hikeid={hikeid} latlng = {latlng} setLatlng = {setLatlng} bounds = {bounds} setBounds = {setBounds} mode = {props.mode} />
              }
          </Modal.Body>


          

          <Modal.Footer>
              {
               (areadragmap && <Button onClick={() => loadFilter("area", bounds)}>Search</Button>) ||
               (markermap && 
               <>
                  <Button onClick={()=>handleContinue("continue")}>
                      Continue
                  </Button>
                
                  <Button onClick={()=>handleContinue("position")}>
                    Pick my position
                  </Button>
               </>
               )
              }
              <Button variant = "secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>

      </Modal>
  );
};

function GetCustomIcon (type) {

  switch(type){
    case "starting":
      return L.icon({
        iconUrl: require('./markericons/start1.png'),
        iconSize: [45, 45],
        iconAnchor: [25, 45],
        popupAnchor: [-2, -45]
      })
    
    case "ending":
      return L.icon({
        iconUrl: require('./markericons/finish1.png'),
        iconSize: [45, 45],
        iconAnchor: [25, 45],
        popupAnchor: [-2, -45]
      })
    
    case "intermediate":
      return L.icon({
        iconUrl: require('./markericons/flag1.png'),
        iconSize: [35, 35],
        iconAnchor: [15, 35],
        popupAnchor: [-2, -45]
      })
    
    case "hut":
      return L.icon({
        iconUrl: require('./markericons/hut.png'),
        iconSize: 30,
      })

    case "parking":
      return L.icon({
        iconUrl: require('./markericons/park.png'),
        iconSize: [35, 35],
        iconAnchor: [15, 35],
        popupAnchor: [-2, -45]
      })

    default:
      break;
  }
}



export {MapItem, AreaDragMap, MarkerMap,MapModal}; 


function Legenda(props) {
  return (
<Accordion className = "mb-2">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Legend</Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col>
              <div className = "mb-2">
                <img src = "http://localhost:3000/start1.png" alt = "symbol1" style = {{"height":"40px"}}/>
                {" "}Starting point
              </div>
              <div className = "mb-2">
              <img src = "http://localhost:3000/finish1.png" alt = "symbol2" style = {{"height":"40px"}}/>
                {" "}Ending point
              </div>
              <div>
              <img src = "http://localhost:3000/flag1.png" alt = "symbol3" style = {{"height":"40px"}}/>
                {" "}Intermediate point
              </div>
            </Col>
            <Col>
              <div className = "mb-2">
                <img src = "http://localhost:3000/hut.png" alt = "symbol4" style = {{"height":"40px"}}/>
                {" "}Hut
              </div>
              <div className = "mb-2">
              <img src = "http://localhost:3000/park.png" alt = "symbol5" style = {{"height":"40px"}}/>
                {" "}Parking lot
              </div>
            </Col>
            
          </Row>
          
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

