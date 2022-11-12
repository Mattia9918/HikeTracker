# Login

## POST

### login apis copiate da Corno

# Hike Informations

## GET

###  api/hikes 

- return an array containing all the hikes

- query parameters: all, length, expectedTime, ascent, province, city, difficulty

- request body: empty

- response: 200 (Ok) 

- permission: every user 

- error response: internal server error (500)


## GET 

### api/hikes/:id

- return an object containig the specified hike

- request body: empty

- response: 200 (Ok) 

- permission: every user 

- error response: internal server error (500)

## POST 

### api/hikes

- create a new hike 

- Request header has a line: Content-Type: application/json.

- request body: a JSON object containing -------------

- response header : 201 (Created success) 

- response body : empty 

- permission allowed : local guide 

- Error responses: 401 Unauthorized (not logged in or wrong permissions), 422 Unprocessable Entity (validation of request body failed), 503 Service Unavailable (generic error).

# GPX

## GET

### api/gpx/:hikeID

- return a gpx given its hikeID

- request body: empty

- response: 200 (Ok) 

- permission: every user (except visitor)

- error response: internal server error (500), 401 Unauthorized (not logged in or wrong permissions)

## POST

### api/gpx/:hikeID

- publish a new gpx

- Request header has a line: Content-Type: application/json.

- request body: {hikeID, (come trasferire il gpx come JSON?)}

- response header : 201 (Created success) 

- response body : empty 

- permission allowed : local guide 

- Error responses: 401 Unauthorized (not logged in or wrong permissions), 422 Unprocessable Entity (validation of request body failed), 503 Service Unavailable (generic error).

# USER

## POST

### api/users

- create new user

- Request header has a line: Content-Type: application/json.

- request body: {user...}

- response header : 201 (Created success) 

- response body : empty 

- Error responses: 422 Unprocessable Entity (validation of request body failed), 503 Service Unavailable (generic error).

# POINT

## GET

### api/points/:latitude/:longitude

- get new point

- Request header has a line: Content-Type: application/json.

- request body: empty

- response: 200 (Ok) 

- response body : empty 

- Error responses: internal server error (500)

## POST

### api/points + http://api.bigdatacloud.net/ per ogni punto

- post new point

- Request header has a line: Content-Type: application/json.

- request body: {point...}

- response header : 201 (Created success) 

- response body : empty 

- Error responses: 422 Unprocessable Entity (validation of request body failed), 503 Service Unavailable (generic error).