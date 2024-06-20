// Middleware to ensure user is authenticated
export function ensureUser(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).json({ message: "User is not authenicated" });
	}
}

// Middleware to ensure user is an instructor
export function ensureInstructor(req, res, next) {
	if (req.user.role === "INSTRUCTOR") {
		next();
	} else {
		res.status(403).json({ message: "User is not a instructor" });
	}
}

// Middleware to ensure user is an admin
export function ensureAdmin(req, res, next) {
	if (req.user.role === "ADMIN") {
		next();
	} else {
		res.status(403).json({ message: "User is not an admin" });
	}
}
