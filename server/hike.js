'use strict';

/**
 * Constructor function for new hike objects
 * @param {number} id
 * @param {string} title
 * @param {number} length
 * @param {string} description
 * @param {string} difficulty
 * @param {number} estimatedTime
 * @param {number} ascent
 * @param {number} localguideID
 */


function Hike (id,title,length,description,difficulty,estimatedTime,ascent,localguideID)
{
    this.id = id;
    this.title = title;
    this.length= length;
    this.description= description;
    this.difficulty = difficulty
    this.estimatedTime= estimatedTime;
    this.ascent = ascent;
    this.localguideID=localguideID;
}

exports.Hike = Hike;