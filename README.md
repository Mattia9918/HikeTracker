
# Requirements
- a machine with docker and docker-compose installed and running
- being registered and logged-in into `https://hub.docker.com/`

# How to run
- create a `docker-compose.yaml` file
- copy the following content inside it
```
version: '2.12.2'
services:
  nodejs-server:
    container_name: nodejs-server
    image: loferro/hike-server:latest
    volumes:
      - '/usr/src/app/node_modules'
    ports:
      - '3001:3001' # expose ports - HOST:CONTAINER

  react-ui:
    container_name: react-ui
    image: loferro/hike-client:latest
    volumes:
      - '/usr/src/app/node_modules'
    ports:
      - '3000:3000' # expose ports - HOST:CONTAINER
    environment:
      - NODE_ENV=development
    depends_on:
      - nodejs-server
```

- open the terminal in the same directory and run the following commands
```
docker-compose pull
docker-compose up -d
```

# Usage

- open the browser and type `http://localhost:3000/`
- login with one of the following credentials

| Email | Password | Role |
| --- | ----------- | ----------|
| luigi.verdi@mail.it | password | platformManager |
| mario.rossi@mail.it | password | localGuide |
| giulia.brambilla@mail.it | password | hiker |
