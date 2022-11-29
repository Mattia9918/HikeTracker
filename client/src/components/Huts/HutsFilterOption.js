

const optionsReach = {
	label:"Reachability",
	eventKey:"1",
    filter:"reach",
    
    options:[
        {label:"normal",filterOption:"normal"},
        {label:"offroad",filterOption:"offroad"},
        {label:"foot",filterOption:"foot"},
        {label:"cable",filterOption:"cable"}
    ]
}


const optionsAltitude = {
    label:"Altitude",
    eventKey:"2",
    filter:"altitude",

    options:[
        {label:"Less than 1000 m",filterOption:"0,1000"},
        {label:"Between 1000 m and 1300 m",filterOption:"1001,1300"},
        {label:"Between 1300 m and 1800 m",filterOption:"1301,1800"},
        {label:"More than 1800 m",filterOption:"1801,100000"}
    ]
   
}


const optionsProvince = {
    label:"Province",
    filter:"province",
    eventKey:"3",
};

const optionsCity = {
    label:"City",
    filter:"city",
    eventKey:"4",
};




const filters = [
    {"option":optionsReach},
    {"option":optionsAltitude},
]
const filtersGeo = [
    {"option":optionsProvince},
    {"option":optionsCity},
    
]

export  {filters,filtersGeo}; 