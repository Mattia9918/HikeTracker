import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Accordion,
  ButtonGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import "leaflet-area-select";

import APIHuts from "../../API/APIHutGet";

import { CardImg, CardHeader, VisibleItem, HiddenItem } from "./HutComp";

import { AccordionFilter, AccordionGeo } from "../Filter";

import { GrPowerReset } from "react-icons/gr";
import { BsMap } from "react-icons/bs";
import { IoMdRestaurant } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { TbDisabled } from "react-icons/tb";
import { MdDirectionsBike } from "react-icons/md";
import { filters, filtersGeo } from "./HutsFilterOption";

import { MapModal } from "../Map/Maps";

//Filter for restaurant/disabled_service/sleep/bike/map/reset
const BtnFilterHut = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [clickedFilter, setClickedFilter] = useState([]);

  const {
    loadFilter,
    insertElementFilterVector,
    removeElementFilterVector,
    filterVector,
    reset,
    huts,
  } = props.obj;

  const serviceFilter = (filter) => {
    const filterClicked = { filterName: filter, clicked: true };

    //se il vettore clickedFilter contiene già il filtro, lo rimuove altrimenti lo aggiunge
    const flag = clickedFilter.some((item) => {
      if (item.filterName === filter && item.clicked === true) return true;
      return false;
    });

    if (flag === false) {
      console.log("Filter = " + filter + " Clicked");
      setClickedFilter([...clickedFilter, filterClicked]);
      insertElementFilterVector({ filterName: filter });
    } else {
      console.log("Filter = " + filter + " Unclicked");
      setClickedFilter(
        clickedFilter.filter((item) => item.filterName !== filter)
      );

      removeElementFilterVector(filter);
    }
  };

  function resetButton() {
    reset();
    setClickedFilter([]);
  }

  return (
    <>
      {showModal && (
        <MapModal
          obj={{
            showModal,
            setShowModal,
            areadragmap: true,
            filterVector,
            loadFilter,
            huts,
          }}
        />
      )}

      {/*Reset | Map */}
      <ButtonGroup className="w-100">
        <Button size="sm" variant="danger" onClick={resetButton}>
          <GrPowerReset /> Reset
        </Button>

        <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>
          <BsMap /> Map
        </Button>
      </ButtonGroup>

      {/*Restaurnt | Disability | Sleep | Bike */}
      <ButtonGroup className="w-100 ">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => serviceFilter("restaurant_service")}
        >
          <IoMdRestaurant /> Restaurant
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => serviceFilter("disabled_services")}
        >
          <TbDisabled /> Disability
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => serviceFilter("beds")}
        >
          <FaBed /> Sleep
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => serviceFilter("bike_friendly")}
        >
          <MdDirectionsBike /> Bike
        </Button>
      </ButtonGroup>
    </>
  );
};

//Filter for province/city/altitude/reachability
const AccordionFilterHut = (props) => {
  const {
    cities,
    provinces,
    loadFilter,
    filterVector,
    insertElementFilterVector,
    removeElementFilterVector,
  } = props.obj;

  return (
    <>
      {/*Filter for ALTITUDE & REACHABILITY*/}
      <Accordion className="mb-2 mt-2">
        <Row>
          {filters.map((f) => {
            return (
              <>
                <Col>
                  <AccordionFilter
                    key={"filterHut" + filters.indexOf(f)}
                    obj={f.option}
                    loadFilter={loadFilter}
                    filterVector={filterVector}
                    insertElementFilterVector={insertElementFilterVector}
                    removeElementFilterVector={removeElementFilterVector}
                  />
                </Col>
              </>
            );
          })}
        </Row>
      </Accordion>

      {/*Filter for PROVINCE & CITIES*/}
      <Accordion>
        <Row>
          {filtersGeo.map((f) => {
            return (
              <>
                <Col>
                  <AccordionGeo
                    key={"filterGeo" + filtersGeo.indexOf(f)}
                    obj={f.option}
                    cities={f.option.label === "Province" ? provinces : cities}
                    filterVector={filterVector}
                    loadFilter={loadFilter}
                    insertElementFilterVector={insertElementFilterVector}
                    removeElementFilterVector={removeElementFilterVector}
                  />
                </Col>
              </>
            );
          })}
        </Row>
      </Accordion>
    </>
  );

  /*
	
	
	*/
};

function HutCard(props) {
  const [open, setOpen] = useState(false);

  const {
    name,
    province,
    city,
    address,
    phone_number,
    email,
    web_site,
    reachability,
    imgPath,
  } = props.Hut;
  const {
    description,
    altitude,
    languages,
    bathrooms,
    beds,
    bike_friendly,
    restaurant_service,
    disabled_services,
  } = props.Hut;

  const objDetails = {
    description,
    address,
    altitude,
    languages,
    bathrooms,
    beds,
    bike_friendly,
    restaurant_service,
    disabled_services,
    reachability,
  };

  const header = `${city}, ${province}`;

  return (
    <Container className="mt-3 mb-3">
      <Card className="shadow-sm p-2">
        {/* -- CARD HEADER -- */}

        <CardHeader header={header} />

        <CardImg imgPath={imgPath} />

        {/* -- CARD BODY -- */}
        <Card.Body
          className="pb-0"
          id="cardbody"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Card.Title>{name}</Card.Title>

          <Card.Text>
            <VisibleItem obj={{ phone_number, email, web_site }} open={open} />
          </Card.Text>

          <HiddenItem obj={objDetails} open={open} />
        </Card.Body>
      </Card>
    </Container>
  );
}

function HutList(props) {
  const [huts, setHuts] = useState([]);
  const [cities, setCities] = useState();
  const [provinces, setProvinces] = useState();
  const [filterVector, setFilterVector] = useState([]);

  const leftArray = huts.filter((v) => huts.indexOf(v) < huts.length / 2);
  const rightArray = huts.filter((v) => huts.indexOf(v) >= huts.length / 2);

  async function loadFilter() {
    try {
      const filteredHutsList = await APIHuts.getFilter2(filterVector);
      console.log(filteredHutsList);
      setHuts(filteredHutsList);
    } catch (err) {
      console.log(err);
    }
  }

  function removeElementFilterVector(filterName) {
    let vect = [...filterVector];
    vect = vect.filter((filt) => filt.filterName !== filterName);
    setFilterVector([...vect]);
  }

  function insertElementFilterVector(elem) {
    let vett = filterVector;
    vett = vett.filter((filt) => filt.filterName !== elem.filterName);
    setFilterVector([...vett, elem]);
  }

  function reset() {
    const newElement = {
      filterName: "none",
    };
    const vec = [];
    vec.push(newElement);
    setFilterVector([...vec]);
    loadFilter(filterVector);
  }

  async function loadHuts() {
    try {
      const hutList = await APIHuts.getHuts();
      setHuts(hutList);
    } catch (err) {}
  }

  async function loadList() {
    const citieslist = await APIHuts.getHutCities();
    setCities(citieslist);

    const provincelist = await APIHuts.getHutProvinces();
    setProvinces(provincelist);
  }

  /*
  async function loadHutFilter(filter, value) {
    try {
      const filteredHutList = await APIHuts.getFilter(filter, value);

      setHuts(filteredHutList);
    } catch (err) {}
  }

  async function loadByArea(filter, value) {
    try {
      const filteredHutList = await APIHuts.getHutFilter(filter, value);
      setHuts(filteredHutList);
    } catch (err) {}
  }
   <AccordionFilterHut obj={obj} />
                   
  */

  useEffect(() => {
    if (filterVector.length === 0) {
      loadHuts();
      loadList();
    } else loadFilter();
  }, [filterVector]);

  const obj = {
    loadFilter,
    insertElementFilterVector,
    removeElementFilterVector,
    filterVector,
    reset,
    huts,
  };

  const objAccordion = {
    cities,
    provinces,
    loadFilter,
    insertElementFilterVector,
    removeElementFilterVector,
    filterVector,
  };

  return (
    <>
      <Row>
        <center>
          <Col lg={8} xs={12}>
            <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
              <Row className="mt-3 mb-1 ms-1 me-1">
                <Accordion>
                  <Accordion.Item eventKey={1}>
                    <Accordion.Header>Filtering options</Accordion.Header>

                    <Accordion.Body>
                      <BtnFilterHut obj={obj} />
                      <AccordionFilterHut obj={objAccordion} />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Row>

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
        </center>
      </Row>
    </>
  );
}

export default HutList;
