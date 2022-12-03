import { useEffect, useState } from 'react';
import {MapContainer,TileLayer,Marker,GeoJSON, Rectangle,Popup} from 'react-leaflet'; 
import {useMap,useMapEvents} from 'react-leaflet/hooks';
import {Modal,Button} from 'react-bootstrap'; 
import APIGpx from '../../API/APIGpx';
import "leaflet-area-select";
import L from 'leaflet';



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
                        <CustomMarker latlng = {props.latlng} setLatlng = {props.setLatlng} />)
                    }
  
                    <Marker position={firstPoint} icon={GetCustomIcon("starting")} >
                      <Popup>Starting Point</Popup>
                    </Marker>

                    <Marker position={lastPoint} icon={GetCustomIcon("ending")}>
                      <Popup>Ending Point</Popup>
                    </Marker>
                    
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
              {areadragmap && <>Press ctrl + mouse drag to define a geographic area where you want to find hikes<br></br><hr></hr></>}
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

