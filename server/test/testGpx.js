const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const dao = require('../modules/dao/hikedao.js');
const { app } = require('../index');
var agent = chai.request.agent(app);

const fileName="new (7).gpx";

//POST GPX (201) 
describe('test api/gpx (success 201 Created)', () => {


    before(async ()=>{
        await dao.deleteGpx();
    }); 

    const gpx = {
        "path":`/uploads/${fileName}` 
    }; 
    addGpx(201, gpx);
    
    
});

/*
//500 = campo gpxfile unique
//POST GPX (500)
describe('test api/gpx (case gpx already defined 500 SQLITE_CONSTRAINT)', () => {


    before(async ()=>{
        await dao.deleteGpx();
    }); 

    
    const gpx = {
        "path":`/uploads/${fileName}` 
    }; 
    addGpx(201, gpx);
    addGpx(500, gpx);
    
});
*/


//API POST GPX
function addGpx(expectedHTTPStatus, gpx) {
    it('test post /api/gpx', async () => {
        await agent.post('/api/gpx')
            .send(gpx)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus===200){
                    res.body.should.have.property("id");
                    res.body.id.should.equal(1);
                }
                else if(expectedHTTPStatus===500){
                    res.body.should.have.property("errno");
                    res.body.should.have.property("code");
                    const codeError = res.body.errno; 
                    const textError = res.body.code; 
                    codeError.should.equal(19); 
                    textError.should.equal("SQLITE_CONSTRAINT");
                    
                }
            }); 

    })
}; 



//GET GPX FILE WITH ID (200)
describe('test api/gpx/:id (success 200 OK)', () => {


    before(async ()=>{
        await dao.deleteGpx();
    }); 

    const gpx = {
        "path":`/uploads/${fileName}` 
    };

    addGpx(201, gpx);
    
    getGpx(200,1);
    
});

//GET GPX FILE WITH ID (404)
describe('test api/gpx/:id (success 404 Not Found)', () => {


    before(async ()=>{
        await dao.deleteGpx();
    }); 
    
    getGpx(404,1);
    
});


//API GET GPX 
function getGpx(expectedHTTPStatus,id) {
    it('test post /api/gpx/:id', async () => {
        await agent.get('/api/gpx/'+id)
        .then(function(res){
            res.should.have.status(expectedHTTPStatus);
            if(expectedHTTPStatus===200){
                //check field geoJson file (features,geometry,coordinates) and check array coordinates length !=0

                res.body.should.have.property("features");
                
                const features = res.body.features[0];
                const geometry = features.geometry; 
                const coordinates = geometry.coordinates; 
                
                features.should.have.property("geometry");
                geometry.should.have.property("coordinates");
                
                expect(coordinates.length).to.not.equal(0);
            }
            
            else if(expectedHTTPStatus===404){
                res.body.should.have.property("err");
                res.body.err.should.have.string("Not Found");
                
            }
        
        })
        ; 
    })
}

