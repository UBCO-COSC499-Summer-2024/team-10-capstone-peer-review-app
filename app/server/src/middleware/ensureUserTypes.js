import apiError from "../utils/apiError.js";

// Middleware to ensure user is authenticated
export function ensureUser(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		next(new apiError("User is not logged in!", 401));
	}
}

// Middleware to ensure user is an instructor
export function ensureInstructor(req, res, next) {
	if (req.user.role === "INSTRUCTOR") {
		next();
	} else {
		next(new apiError("User is not an instructor", 403));
	}
}

// Middleware to ensure user is an instructor
export function ensureStudent(req, res, next) {
	if (req.user.role === "STUDENT") {
		next();
	} else {
		next(new apiError("User is not a student", 403));
	}
}

// Middleware to ensure user is an admin
export function ensureAdmin(req, res, next) {
	if (req.user.role === "ADMIN") {
		next();
	} else {
		next(new apiError("User is not an admin", 403));
	}
}
