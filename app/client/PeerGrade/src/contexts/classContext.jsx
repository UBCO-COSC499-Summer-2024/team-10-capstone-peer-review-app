// src/contexts/ClassContext.jsx
import { createContext, useState } from "react";
import {
	getClassesByUserId,
	getAllClasses,
	createClass,
	deleteClass,
	updateClass
} from "@/api/classApi";

const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
	const [classes, setClasses] = useState([]);
	const [isClassLoading, setIsClassLoading] = useState(false);

	// This is intended to be used by pages for Instructors or Students
	const getUserClasses = async (userId) => {
		try {
			setIsClassLoading(true);
			const classesData = await getClassesByUserId(userId);
			if (Array.isArray(classesData.data)) {
				setClasses(classesData.data);
			}
			setIsClassLoading(false);
		} catch (error) {
			console.error("Failed to fetch classes", error);
		}
	};

	// This is intended to be used by pages for Admins
	// Depending on how many classes are in the database, this could be a very expensive operation, consider pagination for future implementations
	const getAdminClasses = async () => {
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
			setIsClassLoading(false);
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

	const updateClasses = async (updatedClass) => {
		try {
			setIsClassLoading(true);
			const updatedClassData = await updateClass(
				updatedClass.classId,
				updatedClass
			);
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
				getUserClasses,
				getAdminClasses,
				addClass,
				removeClass,
				updateClasses
			}}
		>
			{children}
		</ClassContext.Provider>
	);
};
