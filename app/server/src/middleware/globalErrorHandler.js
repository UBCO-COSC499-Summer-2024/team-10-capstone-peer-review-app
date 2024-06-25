const devErrors = (res, error) => {
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		stackTrace: error.stack,
		error: error
	});
};

const prodErrors = (res, error) => {
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message
		});
	} else {
		res.status(500).json({
			status: "Error",
			message: "Something went wrong"
		});
	}
};

const globalErrorHandler = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500;
	error.status = error.status || "Error";
	if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
		devErrors(res, error);
	} else if (process.env.NODE_ENV === "prod") {
		prodErrors(res, error);
	}
};

export default globalErrorHandler;
