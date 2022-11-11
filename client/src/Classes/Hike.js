function Hike(id, title, length, description, difficulty, ascent, estimatedTime, localguideUsername, startingCity, startingProvince, endingCity, endingProvince)
{
    this.id = id;
    this.title = title;
    this.length = length;
    this.description = description;
    this.difficulty = difficulty;
    this.ascent = ascent;
    this.estimatedTime = estimatedTime;
    this.localguideUsername = localguideUsername;
    this.startingCity = startingCity;
    this.startingProvince = startingProvince;
    this.endingCity = endingCity;
    this.endingProvince = endingProvince;

}

exports.Hike = Hike;