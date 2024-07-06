// src/contexts/ClassContext.jsx
import { createContext, useState } from "react";
import {
	getClassesByUserId,
	getAllClasses,
	createClass,
	deleteClass,
	updateClass
} from "@/api/classApi";

import { useUser } from "./contextHooks/useUser";

export const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
	const [classes, setClasses] = useState([]);
	const [isClassLoading, setIsClassLoading] = useState(false);
	const { user } = useUser();

	// These are the setClass States that retrieve any new data from the backend
	// setUserClasses = students and instructors
	const setUserClasses = async () => {
		try {
			setIsClassLoading(true);
			const classesData = await getClassesByUserId(user.userId);
			if (Array.isArray(classesData.data)) {
				setClasses(classesData.data);
			}
			setIsClassLoading(false);
		} catch (error) {
			console.error("Failed to fetch classes", error);
		}
	};

	// setAdminClasses = instructors and admins
	// Depending on how many classes are in the database, this could be a very expensive operation, consider pagination for future implementations
	const setAdminClasses = async () => {
		try {
			setIsClassLoading(true);
			const classesData = await getAllClasses();
			if (Array.isArray(classesData.data)) {
				setClasses(classesData.data);
			}
			setIsClassLoading(false);
		} catch (error) {
			console.error("Failed to fetch classes", error);
		}
	};
	const addClass = async (newClass) => {
		try {
			setIsClassLoading(true);
			const newClassData = await createClass(newClass);
			setClasses((prevClasses) => [...prevClasses, newClassData.data]);
		} catch (error) {
			console.error("Failed to add class", error);
		}
	};

	const removeClass = async (classId) => {
		try {
			setIsClassLoading(true);
			const deletedClass = await deleteClass(classId);
			setClasses((prevClasses) =>
				prevClasses.filter((cls) => cls.classId !== deletedClass.data.classId)
			);
			setIsClassLoading(false);
		} catch (error) {
			console.error("Failed to remove class", error);
		}
	};

	const updateClasses = async (classId, updatedClass) => {
		try {
			setIsClassLoading(true);
			const updatedClassData = await updateClass(classId, updatedClass);
			setClasses((prevClasses) =>
				prevClasses.map((cls) =>
					cls.id === updatedClassData.data.classId ? updatedClassData.data : cls
				)
			);
			setIsClassLoading(false);
		} catch (error) {
			console.error("Failed to update class", error);
		}
	};

	return (
		<ClassContext.Provider
			value={{
				classes,
				isClassLoading,
				setUserClasses,
				setAdminClasses,
				addClass,
				removeClass,
				updateClasses
			}}
		>
			{children}
		</ClassContext.Provider>
	);
};
