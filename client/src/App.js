import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ticket from './Ticket';
import API from './API';
import Layout from './Layout';
import ServiceType from './ServiceType';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TableItem from './QueuePage.js'

function App() {

  const [services, setServices] = useState();
  const [queue, setQueue] = useState({});
  const [ticketId, setTicketId] = useState();
  const [newService, setNewService] = useState();

  async function takeTicket(serviceId) {
    let myTicketId = await API.postTicket(serviceId);
    setTicketId(myTicketId);
    let q = await API.getWaitingQueue(myTicketId);
    setQueue(q);
  }


  async function loadServices() {
    let servicesList = await API.getServices();
    setServices(servicesList);
  }

  async function postServiceType(serviceType) {
    await API.postServiceType(serviceType);
  }

  function setNewServiceType(serviceType) {
    setNewService(serviceType);
  }

  useEffect(() => {
    loadServices();
  }, [newService]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<Ticket takeTicket={takeTicket} setTicketId={setTicketId} loadServices={loadServices} services={services} />} />
          <Route path='/queue' element={<TableItem ticketId={ticketId} queue = {queue} />} />
          <Route path='/:service' element={<ServiceType postServiceType={postServiceType} setNewServiceType = {setNewServiceType}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
