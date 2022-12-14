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

import { MapModal } from "../Map/Maps";

import { AccordionFilter, AccordionGeo } from "../Filter";
import {
  length,
  time,
  difficulty,
  ascent,
  objProv,
  objCity,
} from "./HikesObjInfo";

import APIHikes from "../../API/APIHikes";
import APIGpx from "../../API/APIGpx";

import { TbMapSearch } from "react-icons/tb";
import { BsMap } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { RiMindMap } from "react-icons/ri";

import {
  CardImg,
  AlertUser,
  CardHeader,
  VisibleItem,
  HiddenItem,
} from "./HikeCardComp";
import { LinkingModal } from "../Linking/Linking";
import { HikeStatusModal } from "../HikeStatus/HikeStatus";

function FilterMenu(props) {
  const [cities, setCities] = useState();
  const [provinces, setProvinces] = useState();
  const [showModal, setShowModal] = useState(false);
  const [filterVector, setFilterVector] = useState([]);
  const [hikesMap, setHikesMap] = useState([]);

  function removeElementFilterVector(filterName) {
    let vect = [...filterVector];
    vect = vect.filter((filt) => filt.filterName !== filterName);
    setFilterVector([...vect]);
  }

  function loadNewFilter() {
    props.loadFilter(filterVector);
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
    props.loadFilter(filterVector);
  }

  useEffect(() => {
    async function loadList() {
      const citieslist = await APIHikes.getHikeCities();
      setCities(citieslist);

      const provincelist = await APIHikes.getHikeProvinces();
      setProvinces(provincelist);

      const hikesMap = await APIGpx.getHikesForMap();
      setHikesMap(hikesMap);
    }
    if (filterVector.length === 0) loadList();

    console.log(filterVector.length);
    loadNewFilter();
  }, [filterVector]);

  return (
    <>
      <Row className="mt-3 mb-1 ms-1 me-1">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filtering options</Accordion.Header>
            <Accordion.Body>
              <Accordion>
                <Row>
                  <Col lg={4}>
                    <AccordionFilter
                      obj={length}
                      loadFilter={props.loadFilter}
                      filterVector={filterVector}
                      removeElementFilterVector={removeElementFilterVector}
                      insertElementFilterVector={insertElementFilterVector}
                    />

                    <AccordionFilter
                      obj={time}
                      loadFilter={props.loadFilter}
                      filterVector={filterVector}
                      removeElementFilterVector={removeElementFilterVector}
                      insertElementFilterVector={insertElementFilterVector}
                    />

                    <AccordionFilter
                      obj={difficulty}
                      loadFilter={props.loadFilter}
                      filterVector={filterVector}
                      removeElementFilterVector={removeElementFilterVector}
                      insertElementFilterVector={insertElementFilterVector}
                    />
                  </Col>

                  <Col lg={4}>
                    <AccordionFilter
                      obj={ascent}
                      loadFilter={props.loadFilter}
                      filterVector={filterVector}
                      removeElementFilterVector={removeElementFilterVector}
                      insertElementFilterVector={insertElementFilterVector}
                    />

                    <AccordionGeo
                      obj={objProv}
                      cities={provinces}
                      loadFilter={props.loadFilter}
                      filterVector={filterVector}
                      removeElementFilterVector={removeElementFilterVector}
                      insertElementFilterVector={insertElementFilterVector}
                    />

                    <AccordionGeo
                      obj={objCity}
                      cities={cities}
                      loadFilter={props.loadFilter}
                      filterVector={filterVector}
                      removeElementFilterVector={removeElementFilterVector}
                      insertElementFilterVector={insertElementFilterVector}
                    />
                  </Col>

                  <Col lg={4}>
                    <ButtonGroup>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        <TbMapSearch
                          style={{
                            fontSize: "1.2rem",
                          }}
                        />{" "}
                        Find
                      </Button>

                      <Button variant="outline-primary" onClick={reset}>
                        <GrPowerReset /> Reset
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>

      {showModal && (
        <MapModal
          obj={{
            showModal,
            setShowModal,
            areadragmap: true,
            loadFilter: props.loadFilter,
            filterVector: filterVector,
            point: hikesMap,
          }}
        />
      )}
    </>
  );
}

function Hikes(props) {
  const [hikes, setHikes] = useState([]);
  const [started, setStarted] = useState();

  async function loadFilter(filterObj) {
    try {
      const filteredHikeList = await APIHikes.getFilter(filterObj);
      setHikes(filteredHikeList);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadHikes() {
    try {
      const hikeList = await APIHikes.getHikes();
      setHikes(hikeList);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadStarted() {
    try {
      const startedHike = await APIHikes.getStartedHike();
      const startedHikeId = startedHike ? startedHike.hikeID : undefined;
      setStarted(startedHikeId);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadHikes();
    loadStarted();
  }, []);

  const leftHikes = hikes.filter((v) => hikes.indexOf(v) < hikes.length / 2);
  const rightHikes = hikes.filter((v) => hikes.indexOf(v) >= hikes.length / 2);

  return (
    <>
      <div className="row gx-0">
        <center>
          <Col lg={8} xs={12}>
            <AlertUser
              obj={{ msg: props.msg, user: props.user, setMsg: props.setMsg }}
            />

            <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
              <FilterMenu loadFilter={loadFilter} />

              <Row>
                {(hikes.length === 1 && hikes[0].id === undefined) || (
                  <>
                    <Col lg={6} xs={12}>
                      {leftHikes.map((hike) => (
                        <HikeCard
                          key={"cardHike_" + hike.id}
                          hike={hike}
                          user={props.user}
                          setHikes={setHikes}
                          started={started}
                          setStarted={setStarted}
                        />
                      ))}
                    </Col>

                    <Col>
                      {rightHikes.map((hike) => (
                        <HikeCard
                          key={"cardHike_" + hike.id}
                          hike={hike}
                          user={props.user}
                          setHikes={setHikes}
                          started={started}
                          setStarted={setStarted}
                        />
                      ))}
                    </Col>
                  </>
                )}
              </Row>
            </Container>
          </Col>
        </center>
      </div>
    </>
  );
}

function HikeCard(props) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <Container className="mt-3 mb-3">
      <Card
        className="shadow-sm p-2"
        id={props.started === props.hike.id ? "startedHikeCard" : undefined}
      >
        {/* -- CARD HEADER -- */}

        <CardHeader
          obj={{
            user: props.hike.localguideUsername,
            level: props.hike.difficulty,
          }}
        />

        <CardImg imgPath={props.hike.imgPath} />

        {/* -- CARD BODY -- */}
        <Card.Body
          className="pb-0"
          id="cardbody"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Card.Title align="center">{props.hike.title}</Card.Title>

          <VisibleItem hike={props.hike} open={open} />

          {open && (
            <HiddenItem
              hike={props.hike}
              started={props.started}
              setShowStatusModal={setShowStatusModal}
              user={props.user}
            />
          )}
        </Card.Body>
        <Row align="right">
          <Col className="mb-1 mx-2">
            {props.user && (
              <Button
                variant="link"
                style={{ padding: "0", margin: "0", marginRight: "10px" }}
                onClick={() => setShowModal(true)}
              >
                <BsMap />
              </Button>
            )}

            {props.user &&
              props.user.role === "localGuide" &&
              props.user.username === props.hike.localguideUsername && (
                <Button
                  variant="link"
                  style={{ padding: "0", margin: "0" }}
                  onClick={() => setShowLinkingModal(true)}
                >
                  <RiMindMap />
                </Button>
              )}
          </Col>
        </Row>
      </Card>

      {showModal && (
        <MapModal
          obj={{
            showModal,
            setShowModal,
            title: props.hike.title,
            hikeid: props.hike.id,
          }}
        />
      )}

      {showLinkingModal && (
        <LinkingModal
          hike={props.hike}
          showLinkingModal={showLinkingModal}
          setShowLinkingModal={setShowLinkingModal}
          setHikes={props.setHikes}
        />
      )}

      {showStatusModal.isVisible && (
        <HikeStatusModal
          hike={props.hike}
          type={showStatusModal.type}
          showStatusModal={showStatusModal}
          setShowStatusModal={setShowStatusModal}
          setStarted={props.setStarted}
        />
      )}
    </Container>
  );
}

export default Hikes;
