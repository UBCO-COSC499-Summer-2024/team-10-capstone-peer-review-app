/**
 * @module routes/todo
 * @desc Provides routes for managing todos.
 */
import express from "express";
import {
	getTodosByClassAndUser,
	createTodo,
	updateTodo,
	deleteTodo
} from "../controllers/todoController.js";
import { ensureUser } from "../middleware/ensureUserTypes.js";

const router = express.Router();

/**
 * @route GET /api/todos/:classId
 * @desc Get all todos for a user in a class.
 * @type {string} classId - The ID of the class.
 * @returns {Array<Object>} An array of todos.
 * @throws {ApiError} If the operation fails, an error is thrown.
 */

/**
 * @route POST /api/todos/:classId
 * @desc Create a new todo.
 * @type {string} classId - The ID of the class.
 * @type {string} content - The content of the todo.
 * @returns {Object} The created todo.
 * @throws {ApiError} If the operation fails, an error is thrown.
 */

router
	.route("/:classId")
	.get(ensureUser, getTodosByClassAndUser)
	.post(ensureUser, createTodo);

/**
 * @route PUT /api/todos/:todoId
 * @desc Update a todo.
 * @type {string} todoId - The ID of the todo.
 * @type {object} updates - The updates to apply to the todo.
 * @returns {Object} The updated todo.
 * @throws {ApiError} If the operation fails, an error is thrown.
 */

/**
 * @route DELETE /api/todos/:todoId
 * @desc Delete a todo.
 * @type {string} todoId - The ID of the todo.
 * @returns {Object} The deleted todo.
 * @throws {ApiError} If the operation fails, an error is thrown.
 */

router
	.route("/:todoId")
	.put(ensureUser, updateTodo)
	.delete(ensureUser, deleteTodo);

export default router;
