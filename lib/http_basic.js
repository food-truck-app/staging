module.exports = exports = function(req, res, next) {
	var userPassEncoded = (req.headers.authorization || ' :').split(' ')[1];
	var userPassBuf = new Buffer(userPassEncoded, 'base64');
	var userPassSplit = userPassBuf.toString('utf8').split(':');
	req.auth = {
		username: String,
		password: String
	};

	if(!(req.auth.username.length && req.auth.password.length)) {
		console.log('could not authenticate: ' + req.auth.username);
		return res.status(401).json({msg: 'could not authenticate'});
	}
	next();
};