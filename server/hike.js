'use strict';

/**
 * Constructor function for new film objects
 * @param {number} id 
 * @param {string} title 
 * @param {number} lenght 
 * @param {string} description 
 * @param {string} difficulty  
 * @param {number} estimatedTime  
 * @param {number} ascent 
 * @param {number} localguideID
 */


function Hike (id,title,lenght,description,difficulty,estimatedTime,ascent,localguideID)
{
  this.id = id;
  this.title = title;
  this.lenght= lenght;
  this.description= description;
  this.difficulty = difficulty
  this.estimatedTime= estimatedTime;
  this.ascent = ascent;
  this.localguideID=localguideID;
}

exports.Hike = Hike;
