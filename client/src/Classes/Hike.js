function Hike(params)
{
    this.id = params[0];
    this.title = params[1];
    this.length = params[2];
    this.description = params[3];
    this.difficulty = params[4];
    this.ascent = params[5];
    this.estimatedTime = params[6];
    this.localguideUsername = params[7];
    this.startingPoint = params[8];
    this.pointsOfInterest = params[9];
    this.endingPoint = params[10];
    this.imgPath = params[11];

}

exports.Hike = Hike;