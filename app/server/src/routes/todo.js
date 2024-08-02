import express from "express";
import {
	getTodosByClassAndUser,
	createTodo,
	updateTodo,
	deleteTodo
} from "../controllers/todoController.js";
import { ensureUser } from "../middleware/ensureUserTypes.js";

const router = express.Router();

router
	.route("/:classId")
	.get(ensureUser, getTodosByClassAndUser)
	.post(ensureUser, createTodo);

router
	.route("/:todoId")
	.put(ensureUser, updateTodo)
	.delete(ensureUser, deleteTodo);

export default router;
