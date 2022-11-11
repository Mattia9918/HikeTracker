function Hike(id, title, length, description, difficulty, ascent, estimatedTime, localguideUsername, startingPoint, pointsOfInterest, endingPoint)
{
    this.id = id;
    this.title = title;
    this.length = length;
    this.description = description;
    this.difficulty = difficulty;
    this.ascent = ascent;
    this.estimatedTime = estimatedTime;
    this.localguideUsername = localguideUsername;
    this.startingPoint = startingPoint;
    this.pointsOfInterest = pointsOfInterest;
    this.endingPoint = endingPoint;

}

exports.Hike = Hike;