import { Hike } from '../Classes/Hike';

const APIURL = 'http://localhost:3001/api/'


async function getHikes() {
    const url = APIURL + `hikes`;
     try {
         const response = await fetch(url, {
             credentials: 'include',
         });
         if (response.ok) {
             const list = await response.json();
             const hikeList = list.map((hike) => 
                 new Hike(
                     hike.id,
                     hike.title,
                     hike.length,
                     hike.description,
                     hike.difficulty,
                     hike.ascent,
                     hike.estimatedTime,
                     hike.localguideUsername,
                     hike.startingPoint,
                     hike.pointsOfInterest,
                     hike.endingPoint
                 ));
             return hikeList;
         } else {
             /* Application error */
             const appErrText = await response.text();
             throw new TypeError(appErrText);
         }
     } catch (err) {
         /* Network error */
         console.log(err);
         throw (err);
     }
 };
 
 async function getFilter(filter, value) {
    let couple;

     if (value !== undefined && typeof value !== "object") {
         couple = value.split(',')
     } else if (typeof value === "object") {
        let northEastLimit = value._northEast;
        let southWestLimit = value._southWest;
        let neLat = northEastLimit.lat;
        let neLng = northEastLimit.lng;
        let swLat = southWestLimit.lat;
        let swLng = southWestLimit.lng;
        couple = [[neLat, neLng], [swLat, swLng]]
     } else {
         couple = [undefined, undefined]
     }
     const url = APIURL + `hike?filter=${filter}&value1=${couple[0]}&value2=${couple[1]}`;
      try {
          const response = await fetch(url, {
              credentials: 'include',
          });
          if (response.ok) {
              const list = await response.json();
              console.log(list)
              const filteredHikeList = list.map((hike) => 
                  new Hike(
                      hike.id,
                      hike.title,
                      hike.length,
                      hike.description,
                      hike.difficulty,
                      hike.ascent,
                      hike.estimatedTime,
                      hike.localguideUsername,
                      hike.startingPoint,
                      hike.pointsOfInterest,
                      hike.endingPoint
                  ));
              return filteredHikeList;
          } else {
              /* Application error */
              const appErrText = await response.text();
              throw new TypeError(appErrText);
          }
      } catch (err) {
          /* Network error */
          console.log(err);
          throw (err);
      }
  };

  async function getHikeCities() {
    const url = APIURL + `cities`;
     try {
         const response = await fetch(url, {
             credentials: 'include',
         });
         if (response.ok) {
             const citieslist = await response.json();
             return citieslist;
         } else {
             /* Application error */
             const appErrText = await response.text();
             throw new TypeError(appErrText);
         }
     } catch (err) {
         /* Network error */
         console.log(err);
         throw (err);
     }
 };

 
 async function getHikeProvinces() {
    const url = APIURL + `provinces`;
     try {
         const response = await fetch(url, {
             credentials: 'include',
         });
         if (response.ok) {
             const provinceslist = await response.json();
             return provinceslist;
         } else {
             /* Application error */
             const appErrText = await response.text();
             throw new TypeError(appErrText);
         }
     } catch (err) {
         /* Network error */
         console.log(err);
         throw (err);
     }
 };



  const APIHikes = {getFilter, getHikes, getHikeCities, getHikeProvinces}; 
  export default APIHikes; 