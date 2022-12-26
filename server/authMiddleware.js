
exports.isLocalGuide = (req, res, next) => {
	if(req.isAuthenticated()) {
        if(req.user.role === 'localGuide')
            return next();
	}
	return res.status(401).json({error: 'Not authorized'});
}

exports.isHiker = (req, res, next) => {
	if(req.isAuthenticated()) {
        if(req.user.role === 'hiker')
            return next();
	}
	return res.status(401).json({error: 'Not authorized'});
}

exports.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
	    return next();
	}
	return res.status(401).json({error: 'Not authorized'});
}