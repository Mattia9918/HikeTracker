//Image Link for Hut card 

const url = "http://localhost:3000/images/"; 
const normal = url+"nicehut.jpg"; 
const offroad = url+"huttra.jpg"; 
const foot = url+"rifugetto.jpg"; 
const cable = url+"rifugiobello.jpg"; 
const hutbike = url+"hutbike.jpg"; 


//Object for filter dropdown 
const optionsReach = {
	label:"Reachability",
	eventKey:"1",
    filter:"reachability",
    
    options:[
        {label:"With normal car",filterOption:"With normal car"},
        {label:"With off-road car",filterOption:"With off-road car"},
        {label:"On foot",filterOption:"On foot"},
        {label:"Cableway",filterOption:"Cableway"}
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

const cardImg = {
    options:[
        {link:"link1",label:"normal"},
        {link:"link2",label:"offroad"},
        {link:"link3",label:"foot"},
        {link:"link4",label:"cable"},
    ]
}

//Insert props with bold_label (boldLabel:Name, name:props.Name)

//Insert props with badge for choose the proper color
const cardHead = {
    boldLabel:"Blabel",
    badge:[
        {label:"easy",value:"success"},
        {label:"average",value:"warning"},
        {label:"difficult",value:"danger"},
    ]
}


export  {filters,filtersGeo,
    normal,offroad,foot,cable,hutbike,cardImg,cardHead
}; 