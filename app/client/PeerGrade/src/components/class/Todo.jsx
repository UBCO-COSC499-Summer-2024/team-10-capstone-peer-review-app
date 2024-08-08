// The component for adding a new todo in a class (in home page for a class view - Class.jsx)

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import {
	getTodosByClassAndUser,
	createTodo,
	updateTodo,
	deleteTodo
} from "@/api/todoApi";
import { useToast } from "@/components/ui/use-toast";

const Todo = ({ classId, userId }) => {
	const [todos, setTodos] = useState([]);
	const [newTodoContent, setNewTodoContent] = useState("");
	const { toast } = useToast();

	// Fetch the todos when the classId or userId changes
	useEffect(() => {
		fetchTodos();
	}, [classId, userId]);

	// Fetch the todos from the server
	const fetchTodos = async () => {
		try {
			const response = await getTodosByClassAndUser(classId);
			setTodos(response.data);
		} catch (error) {
			console.error("Failed to fetch todos", error);
			toast({
				title: "Error",
				description: "Failed to fetch todos",
				variant: "destructive"
			});
		}
	};

	// Handle adding a new todo
	const handleAddTodo = async () => {
		try {
			if (!newTodoContent) return;
			const response = await createTodo(classId, newTodoContent);
			setTodos([response.data, ...todos]);
			setNewTodoContent("");
		} catch (error) {
			console.error("Failed to add todo", error);
			toast({
				title: "Error",
				description: "Failed to add todo",
				variant: "destructive"
			});
		}
	};

	// Handle toggling the completion of a todo
	const handleToggleTodo = async (todoId, completed) => {
		try {
			await updateTodo(todoId, { completed });
			setTodos(
				todos.map((todo) =>
					todo.todoId === todoId ? { ...todo, completed } : todo
				)
			);
		} catch (error) {
			console.error("Failed to update todo", error);
			toast({
				title: "Error",
				description: "Failed to update todo",
				variant: "destructive"
			});
		}
	};

	// Handle deleting a todo
	const handleDeleteTodo = async (todoId) => {
		try {
			await deleteTodo(todoId);
			setTodos(todos.filter((todo) => todo.todoId !== todoId));
		} catch (error) {
			console.error("Failed to delete todo", error);
			toast({
				title: "Error",
				description: "Failed to delete todo",
				variant: "destructive"
			});
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex space-x-2">
				<Input
					value={newTodoContent}
					onChange={(e) => setNewTodoContent(e.target.value)}
					placeholder="Add a new todo"
					className="flex-grow"
					onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
				/>
				<Button
					onClick={handleAddTodo}
					className="bg-primary hover:bg-primary/90"
				>
					<Plus className="h-4 w-4 mr-1" /> Add
				</Button>
			</div>
			{todos && todos.length > 0 ? (
				<div className="space-y-2">
					{todos.map((todo) => (
						<div
							key={todo.todoId}
							className="flex items-center justify-between p-3 bg-slate-100 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
						>
							<div className="flex items-center space-x-3">
								<Checkbox
									checked={todo.completed}
									onCheckedChange={(checked) =>
										handleToggleTodo(todo.todoId, checked)
									}
									className="h-5 w-5"
									data-testid={`toggle-todo-${todo.todoId}`}
								/>
								<span
									className={`text-sm ${
										todo.completed
											? "line-through text-muted-foreground"
											: "text-foreground"
									}`}
								>
									{todo.content}
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDeleteTodo(todo.todoId)}
								className="text-muted-foreground hover:text-destructive"
								data-testid={`delete-todo-${todo.todoId}`}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-muted-foreground">
					No todos yet. Add one above!
				</p>
			)}
		</div>
	);
};

export default Todo;
