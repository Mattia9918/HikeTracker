

const length = {eventKey:"1",options:[{
    label:"Between 0 and 10 km",
    filterOption:"0,10"
},{
    label:"Between 10 and 20 km",
    filterOption:"11,20"
},{
    label:"More than 20 km",
    filterOption:"21,1000"
}
],
label:"Length",filter:"length"}; 


const time = {eventKey:"2",options:[{
    label:"Less than 1 hour",
    filterOption:"0,1"
},{
    label:"Between 1 and 2 hour",
    filterOption:"1,2"
},{
    label:"Between 2 and 3 hour",
    filterOption:"2,3"
},{
    label:"More than 3 hour",
    filterOption:"3,1000"
}
],
label:"Estimated Time",filter:"expectedTime"}; 

const difficulty = {eventKey:"3",options:[{
    label:"Easy",
    filterOption:"Easy"
},{
    label:"Average",
    filterOption:"Average"
},{
    label:"Difficult",
    filterOption:"Difficult"
}
],
label:"Difficulty",filter:"difficulty"}; 

const ascent = {eventKey:"4",options:[{
    label:"Steep descent (more than -100m)",
    filterOption:"-10000,-101"
},{
    label:"Small descent (less than -100m)",
    filterOption:"-100,-1"
},{
    label:" Small ascent (Less than 100 m)",
    filterOption:"0,100"
},{
    label:"Decent ascent (between 100 m and 300 m)",
    filterOption:"101,300"
},{
    label:"Steep ascent (Between 300 m and 600 m)",
    filterOption:"301,600"
},
{
    label:"Climbing (more than 600 m)",
    filterOption:"601,100000"
}
],
label:"Ascent",filter:"ascent"}; 


const objProv = {
    label:"Province",
    filter:"province",
    eventKey:"5"
};

const objCity = {
    label:"City",
    filter:"city",
    eventKey:"6"
};

const url = "http://localhost:3000/images/"; 
const easyHikeImg = url+"easyhike.jpg"; 
const avgHikeImg = url+"averagehike.jpg"; 
const diffHikeImg = url+"difficulthike.jpg"; 


export {length,time,difficulty,ascent,objProv,objCity,
        easyHikeImg,avgHikeImg,diffHikeImg
}; 
