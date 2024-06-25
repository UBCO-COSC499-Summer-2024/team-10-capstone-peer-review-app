// Async Error function to remove the need for try/catch blocks in async functions
// Makes code cleaner and more readable
const asyncErrorHandler = (func) => {
	return (req, res, next) => {
		func(req, res, next).catch((error) => next(error));
	};
};

export default asyncErrorHandler;
