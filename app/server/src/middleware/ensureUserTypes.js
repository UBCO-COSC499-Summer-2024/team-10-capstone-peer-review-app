import apiError from "../utils/apiError.js";

// Middleware to ensure user is authenticated
export function ensureUser(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		next(new apiError("User is not authenticated", 401));
	}
}

// Middleware to ensure user is an instructor
export function ensureInstructor(req, res, next) {
	if (req.user.role === "INSTRUCTOR") {
		next();
	} else {
		next(new apiError("User is not an instructor", 401));
	}
}

// Middleware to ensure user is an admin
export function ensureAdmin(req, res, next) {
	if (req.user.role === "ADMIN") {
		next();
	} else {
		next(new apiError("User is not an admin", 401));
	}
}
