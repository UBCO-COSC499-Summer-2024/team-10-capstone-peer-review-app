/**
 * @file todoController.js
 * @module todoController
 * @desc Provides functions for todo operations
 */
import todoService from "../services/todoService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @function getTodosByClassAndUser
 * @desc Retrieves all todos for a user in a class
 * @param {Request} req - The request object containing the class ID and user ID, if the user is authenticated
 * @returns {Promise<Response>} The response object
 * @throws {ApiError} If failed to retrieve todos
 */
export const getTodosByClassAndUser = asyncErrorHandler(async (req, res) => {
	const { classId } = req.params;
	const userId = req.user.userId;
	const todos = await todoService.getTodosByClassAndUser(classId, userId);
	return res.status(200).json({
		status: "Success",
		data: todos
	});
});

/**
 * @async
 * @function createTodo
 * @desc Creates a new todo
 * @param {Request} req - The request object containing the class ID, user ID, and todo content
 * @returns {Promise<Response>} The response object
 */
export const createTodo = asyncErrorHandler(async (req, res) => {
	const { classId } = req.params;
	const userId = req.user.userId;
	const { content } = req.body;
	const newTodo = await todoService.createTodo(classId, userId, content);
	return res.status(201).json({
		status: "Success",
		data: newTodo
	});
});

/**
 * @async
 * @function updateTodo
 * @desc Updates a todo
 * @param {Request} req - The request object containing the todo ID and updates
 * @returns {Promise<Response>} The response object
 */
export const updateTodo = asyncErrorHandler(async (req, res) => {
	const { todoId } = req.params;
	const updates = req.body;
	const updatedTodo = await todoService.updateTodo(todoId, updates);
	return res.status(200).json({
		status: "Success",
		data: updatedTodo
	});
});

/**
 * @async
 * @function deleteTodo
 * @desc Deletes a todo
 * @param {Request} req - The request object containing the todo ID
 * @returns {Promise<Response>} The response object
 */
export const deleteTodo = asyncErrorHandler(async (req, res) => {
	const { todoId } = req.params;
	await todoService.deleteTodo(todoId);
	return res.status(200).json({
		status: "Success",
		message: "Todo deleted successfully"
	});
});
