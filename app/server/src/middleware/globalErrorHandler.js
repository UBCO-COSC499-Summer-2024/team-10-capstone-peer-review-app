const devErrors = (res, error) => {
	res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
		stackTrace: error.stack,
		error: error
	});
};

const prodErrors = (res, error) => {
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.statusCode,
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
	// For now, we don't have nodeENVs set up so just gonna return devErrors by default
	if (process.env.NODE_ENV === "development") {
		devErrors(res, error);
	} else if (process.env.NODE_ENV === "production") {
		prodErrors(res, error);
	}

	devErrors(res, error);
};

export default globalErrorHandler;
