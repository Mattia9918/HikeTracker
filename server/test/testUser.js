const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const dao = require('../modules/dao/userdao.js');
const { app } = require('../index');
let agent = chai.request.agent(app);




//REGISTER 

//utente inserito con successo (200)
describe('test api/register (case success 200)', () => {


    before(async ()=>{
        dao.deleteUser(); 
        dao.deleteTableActivation(); 
    }); 

    const user = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password",
        "name":"name",
        "surname":"surname",
        "username":"username",
    }; 

    it('test post /api/register', async () => {
        await agent.post('/api/register')
            .send(user)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property("code"); 
                const code = res.body.code; 
                dao.getActivationByCode(code).then(email=>{
                    email.should.equal(user.email);
                }); 
               
            }); 

    })
    
});

//formato dati utente non valido (email senza "@",...) (422)
describe('test api/register (case invalid data 422)', () => {


    before(async ()=>{
        await dao.deleteUser();
        await dao.deleteTableActivation();
    }); 

    const user = {
        "email":"cgmail.com",
        "role":"admin",
        "password":"password",
        "name":"name",
        "surname":"surname",
        "username":"username",
    }; 
    register(422, user); 
    
});

//utente già registrato (500)
describe('test api/register (case user already defined 500)', () => {


    before(async ()=>{
        await dao.deleteUser();
        await dao.deleteTableActivation();
    }); 

    const user = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password",
        "name":"name",
        "surname":"surname",
        "username":"username",
    }; 
    register(200, user);
    register(500, user);
    
});

//API REGISTER UTENTE
function register(expectedHTTPStatus, user) {
    it('test post /api/register', async () => {
        await agent.post('/api/register')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus===422)
                    res.text.should.have.string("Invalid value");
                else if(expectedHTTPStatus===500) 
                    res.text.should.have.string("Email already registered!");
            }); 

    })
}


//VALIDATE

//utente registrato correttamente (200)
describe('test api/validate/:code', async() => {

    const user = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password",
        "name":"name",
        "surname":"surname",
        "username":"username",
    };

    before(async ()=>{
        dao.deleteUser(); 
        dao.deleteTableActivation(); 
        
    }); 
    
    validate(200, user);
    
    
});

//riga activation non presente (500)
describe('test api/validate/:code', () => {


    before(async ()=>{
        dao.deleteUser(); 
        dao.deleteTableActivation(); 
    }); 

    validateByCode(500, "12345");
    
});


//API VALIDATE = controllo utente registrato (200)
function validate(expectedHTTPStatus,user) {
    it('test post /api/validate/:code', async () => {
        const code = await agent.post('/api/register')
        .send(user)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            return res.body.code; 
        });
    
        await agent.get('/api/validate/'+code)
        .then(function(res){
            res.should.have.status(expectedHTTPStatus);
            const utente = res.body; 
            utente.should.have.property("email"); 
            utente.should.have.property("username"); 
            utente.email.should.equal(user.email); 
            utente.username.should.equal(user.username);  
        })
        ; 
    })
}

//API VALIDATE = controllo riga activation rimasta (500)
function validateByCode(expectedHTTPStatus, code) {
    it('test post /api/validate/:code', async () => {
        await agent.get('/api/validate/'+code)
        .then(function(res){
            res.should.have.status(expectedHTTPStatus);
        })
        ; 
    })
}



//LOGIN 

//utente login corretto (200)
describe('test api/sessions 200', async() => {

    const user = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password",
        "name":"name",
        "surname":"surname",
        "username":"username",
    }; 

    before(async ()=>{
        dao.deleteUser(); 
        dao.deleteTableActivation(); 
        
        const code = await agent.post('/api/register')
        .send(user)
        .then(function (res) {
            return res.body.code; 
        }); 
        await agent.get('/api/validate/'+code); 

        
    }); 

    it('test post /api/sessions', async () => {
        

        await agent.post('/api/sessions') 
        .send({username:user.email,password:user.password})
        .then(function (res) {
            res.should.have.status(200);
            const utente = res.body; 
            utente.email.should.equal(user.email); 
            
        
        });  

    })
    
    
});


//utente non registrato (401)
describe('test api/sessions 401', async() => {

    before(async ()=>{
        dao.deleteUser(); 
        dao.deleteTableActivation();
        
    }); 

    login(401,{username:"d@gmail.com",password:"test"})
    
});

//utente registrato password sbagliata (401)
describe('test api/sessions 200', async() => {

    const user = {
        "email":"c@gmail.com",
        "role":"admin",
        "password":"password",
        "name":"name",
        "surname":"surname",
        "username":"username",
    }; 

    before(async ()=>{
        dao.deleteUser(); 
        dao.deleteTableActivation(); 
        
        const code = await agent.post('/api/register')
        .send(user)
        .then(function (res) {
            return res.body.code; 
        }); 
        await agent.get('/api/validate/'+code); 

        
    }); 

    it('test post /api/sessions', async () => {
        

        await agent.post('/api/sessions') 
        .send({username:user.email,password:"1234"})
        .then(function (res) {
            res.should.have.status(401);
            
        
        });  

    })
    
    
});


//API LOGIN 
function login(expectedHTTPStatus, user) {
    it('test post /api/sessions', async () => {
        

        await agent.post('/api/sessions') 
        .send({username:user.email,password:user.password})
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
        });  

    })
}


