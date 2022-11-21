
const togeojson = require("@mapbox/togeojson"); //convert from xml->json
const DomParser = require("xmldom").DOMParser; // node doesn't have xml parsing or a dom.
const fs = require("fs"); //file system manager (readFile)

function text2Binary(string) {
  return string.split('').map(function (char) {
    return char.charCodeAt(0).toString(2);
  }).join(' ');
}

function binary2Text(bin){
  return bin.split(" ").map(function(binary){
    return String.fromCharCode(parseInt(binary,2));
  }).join(""); 
}

exports.getGeoJSON=(file)=>{

 
if (file) {
  const fileParsedFromDom = new DomParser().parseFromString(
    fs.readFileSync(file, "utf-8")
    
  );
  // Convert GPX to GeoJSON
  const converted = togeojson.gpx(fileParsedFromDom);
  return converted; 
  
}
  return {}; 
 
}

exports.castFileToBinary=(file)=>{
  
  //charCodeAt => char to number (q = 113)
  //toString(2) => number to binary (1024 = 10000000000)
  if(file)
    return text2Binary(fs.readFileSync(file,"utf-8")); 
  
  return "";
}

exports.convertBLOB2String=(bin)=>{
  if(bin)
    return binary2Text(bin); 
  
  return "";
}

exports.getGeoJSONbyContent=(xml)=>{
  const fileParsedFromDom = new DomParser().parseFromString(xml);
  const converted = togeojson.gpx(fileParsedFromDom);
  return converted; 
}

