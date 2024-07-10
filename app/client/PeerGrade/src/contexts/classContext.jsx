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
		} catch (error) {
			console.error("Failed to fetch classes", error);
		} finally {
			setIsClassLoading(false);
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
		} catch (error) {
			console.error("Failed to fetch classes", error);
		} finally {
			setIsClassLoading(false);
		}
	};
	const addClass = async (newClass) => {
		try {
			setIsClassLoading(true);
			const newClassData = await createClass(newClass);
			console.log("newClassData", newClassData);
			if (user && user.role === "ADMIN") {
				setAdminClasses();
			} else if (user) {
				setUserClasses();
			}
		} catch (error) {
			console.error("Failed to add class", error);
		} finally {
			setIsClassLoading(false);
		}
	};

	const removeClass = async (classId) => {
		try {
			setIsClassLoading(true);
			await deleteClass(classId);
			if (user && user.role === "ADMIN") {
				setAdminClasses();
			} else if (user) {
				setUserClasses();
			}
		} catch (error) {
			console.error("Failed to remove class", error);
		} finally {
			setIsClassLoading(false);
		}
	};

	const updateClasses = async (classId, updatedClass) => {
		try {
			setIsClassLoading(true);
			await updateClass(classId, updatedClass);
			if (user && user.role === "ADMIN") {
				setAdminClasses();
			} else if (user) {
				setUserClasses();
			}
		} catch (error) {
			console.error("Failed to update class", error);
		} finally {
			setIsClassLoading(false);
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
