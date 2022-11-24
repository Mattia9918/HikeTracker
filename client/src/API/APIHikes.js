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
         throw (err);
     }
 };
 
 async function getFilter(filter, value) {
     var couple;
     if (value != undefined) {
         couple = value.split(',')
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
          throw (err);
      }
  };



  const APIHikes = {getFilter, getHikes}; 
  export default APIHikes; 