import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

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
