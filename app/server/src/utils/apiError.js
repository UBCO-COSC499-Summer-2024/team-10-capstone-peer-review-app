export default class apiError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = "Error";
		// In order to tell if its a programming error or operational error
		this.isOperational = true;
		// Capturing the stack trace so custom errors portray the same stack trace as the built-in errors
		apiError.captureStackTrace(this, this.constructor);
	}
}
