const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { app } = require('../index');
var agent = chai.request.agent(app);


describe('test register user api', () => {


    beforeEach(async ()=>{
        await agent.delete('/api/deleteUser');
        await agent.delete('/api/deleteTableActivation');
    }); 

    const userAdd = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password"
    }; 
    register(200, userAdd);
   
    
});
 
function register(expectedHTTPStatus, user) {
    it('test post /api/register', async () => {
        await agent.post('/api/register')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            }); 

    })
}


describe('test validate user api', () => {


    beforeEach(async ()=>{
        await agent.delete('/api/deleteUser');
        await agent.delete('/api/deleteTableActivation');
        
    }); 


    const userAdd = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password"
    }; 
    validate(200, userAdd);
    
    
});


function validate(expectedHTTPStatus, user) {
    it('test post /api/validate/:code', async () => {
        await agent.post('/api/register')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            }); 
        const code = await agent.get('/api/getActivationByEmail')
            .send({"email":"c@gmail.com",})
        await agent.get('/api/validate/'+code); 
    })
}

