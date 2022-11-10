function Hike(id, title, length, description, difficulty, ascent, estimatedTime, localguideID)
{
    this.id = id;
    this.title = title;
    this.length = length;
    this.description = description;
    this.difficulty = difficulty;
    this.ascent = ascent;
    this.estimatedTime = estimatedTime;
    this.localguideId = localguideID;
}

exports.Hike = Hike;