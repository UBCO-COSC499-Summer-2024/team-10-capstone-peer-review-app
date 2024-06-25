# Api Architecture:

### Clean Architecture Approach:

This project follows a modular structure with clear separation of concerns, inspired by Clean Architecture practices. Here's a brief overview of the main directories and their responsibilities:

- `controllers`: This directory contains all the controller files. Controllers handle the incoming HTTP requests, delegate the business logic to the appropriate services, and send back a response to the client.

- `services`: This directory contains all the service files. Services encapsulate the business logic of the application. They interact with the data access layer to retrieve, insert, update, and delete data.

- `routes`: This directory contains all the route files. Routes define the endpoints of the application and map them to the appropriate controllers.

- `middlewares`: This directory contains all the middleware functions. Middlewares are functions that have access to the request and response objects, and the next middleware function in the application’s request-response cycle. They can execute any code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function in the stack.

- `utils`: This directory contains any utilitary methods or helpers, I.E. node_mailer helper, prisma cleanup helper, as well as all the custom error handling.

# Error Handling

This project uses a custom error handling mechanism to provide more control over error handling and to make the error responses more consistent. Here's a brief overview:

## ApiError

`ApiError` is a custom error class that extends the built-in `Error` class. It is defined in [`apiError.js`](app/server/src/utils/apiError.js). 

- When an instance of `ApiError` is created, it takes a `message` and a `statusCode` as parameters. The `message` is the error message and the `statusCode` is the HTTP status code that should be returned.

- The `status` property of the `ApiError` instance is set based on the `statusCode`. If the `statusCode` is between 400 and 500, the `status` is set to "fail". Otherwise, it's set to "error".

- The `isOperational` property is set to `true` to indicate that this is an operational error, not a programming error.

- The `Error.captureStackTrace()` method is called to provide a stack trace for the error.

## asyncErrorHandler

`asyncErrorHandler` is a higher-order function that wraps asynchronous route handlers to catch any errors they throw and pass them to the next middleware function. It is defined in [`asyncErrorHandler.js`](app/server/src/utils/asyncErrorHandler.js).

- When `asyncErrorHandler` is called with an asynchronous function as an argument, it returns a new function.

- This new function takes `req`, `res`, and `next` as parameters and calls the original function with these parameters.

- If the original function throws an error, the new function catches it and passes it to the next middleware function.

## globalErrorHandler

`globalErrorHandler` is a middleware function that handles all errors thrown in the application. It is defined in [`errorController.js`](app/server/src/controllers/errorController.js).

- When `globalErrorHandler` is called with an error, `req`, `res`, and `next` as parameters, it first checks if the error has a `statusCode` and `status`. If not, it sets them to 500 and "error", respectively.

- Then, it sends a response with the error's `statusCode` and a JSON object containing the `statusCode` and the error's `message`.

By using `ApiError`, `asyncErrorHandler`, and `globalErrorHandler`, you can write cleaner and more consistent error handling code. When an error occurs, you can simply throw an `ApiError` and let `asyncErrorHandler` and `globalErrorHandler` take care of the rest.

# Formatting and Organization

- Each feature of the application should have its own controller, service, and route file. This ensures that the codebase is easy to navigate and maintain.

- Controller methods should be thin and delegate most of the work to services. They should only be responsible for receiving the request, passing the data to the appropriate service, and sending the response.

- Service methods should encapsulate the business logic and interact with the data access layer. They should be independent of the outer application layers like HTTP and databases.

- Route files should only map the endpoints to the appropriate controller methods. They should not contain any business logic.

- Middleware functions should be small and focused on a single task. They should be used for tasks like logging, error handling, request validation, and authentication.

- Custom error handling should be used to catch and handle errors in a consistent manner. It should provide meaningful error messages and appropriate HTTP status codes.
