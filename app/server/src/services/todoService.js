/**
 * @fileoverview todoService.js is a file that contains the functions to interact with the todo table in the database.
 * @module todoService
 */
import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

/**
 * @desc Retrieves all todos for a user in a class ordered by creation date in descending order.
 * @param {string} classId - The ID of the class.
 * @param {string} userId - The ID of the user.
 * @returns {Promise} A promise that contains the todos for the user in the class.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function getTodosByClassAndUser
 */
const getTodosByClassAndUser = async (classId, userId) => {
	try {
		const todos = await prisma.todo.findMany({
			where: {
				classId,
				userId
			},
			orderBy: {
				createdAt: "desc"
			}
		});
		return todos;
	} catch (error) {
		throw new apiError("Failed to retrieve todos", 500);
	}
};

/**
 * @desc Creates a new todo.
 * @param {string} classId - The ID of the class.
 * @param {string} userId - The ID of the user.
 * @param {string} content - The content of the todo.
 * @returns {Promise} A promise that contains the created todo.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function createTodo
 */
const createTodo = async (classId, userId, content) => {
	try {
		const newTodo = await prisma.todo.create({
			data: {
				classId,
				userId,
				content
			}
		});
		return newTodo;
	} catch (error) {
		throw new apiError("Failed to create todo", 500);
	}
};

/**
 * @desc Updates a todo.
 * @param {string} todoId - The ID of the todo.
 * @param {object} updates - The updates to apply to the todo.
 * @returns {Promise} A promise that contains the updated todo.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function updateTodo
 */
const updateTodo = async (todoId, updates) => {
	try {
		const updatedTodo = await prisma.todo.update({
			where: { todoId },
			data: updates
		});
		return updatedTodo;
	} catch (error) {
		throw new apiError("Failed to update todo", 500);
	}
};

/**
 * @desc Deletes a todo.
 * @param {string} todoId - The ID of the todo.
 * @returns {Promise} A promise that contains the deleted todo.
 * @throws {ApiError} If the operation fails, an error is thrown.
 * @async
 * @function deleteTodo
 */
const deleteTodo = async (todoId) => {
	try {
		await prisma.todo.delete({
			where: { todoId }
		});
	} catch (error) {
		throw new apiError("Failed to delete todo", 500);
	}
};

export default {
	getTodosByClassAndUser,
	createTodo,
	updateTodo,
	deleteTodo
};
