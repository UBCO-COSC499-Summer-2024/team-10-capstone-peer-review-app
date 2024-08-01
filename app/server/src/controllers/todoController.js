import todoService from "../services/todoService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const getTodosByClassAndUser = asyncErrorHandler(async (req, res) => {
	const { classId } = req.params;
	const userId = req.user.userId;
	const todos = await todoService.getTodosByClassAndUser(classId, userId);
	return res.status(200).json({
		status: "Success",
		data: todos
	});
});

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

export const updateTodo = asyncErrorHandler(async (req, res) => {
	const { todoId } = req.params;
	const updates = req.body;
	const updatedTodo = await todoService.updateTodo(todoId, updates);
	return res.status(200).json({
		status: "Success",
		data: updatedTodo
	});
});

export const deleteTodo = asyncErrorHandler(async (req, res) => {
	const { todoId } = req.params;
	await todoService.deleteTodo(todoId);
	return res.status(200).json({
		status: "Success",
		message: "Todo deleted successfully"
	});
});
