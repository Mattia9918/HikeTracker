function Hike(id, title, length, description, difficulty, ascent, estimatedTime, localguideUsername)
{
    this.id = id;
    this.title = title;
    this.length = length;
    this.description = description;
    this.difficulty = difficulty;
    this.ascent = ascent;
    this.estimatedTime = estimatedTime;
    this.localguideUsername = localguideUsername;
}

exports.Hike = Hike;