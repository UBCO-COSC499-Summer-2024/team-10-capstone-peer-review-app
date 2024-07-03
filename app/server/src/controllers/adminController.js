// Import necessary modules and services
import adminService from "../services/adminService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Controller methods for class operations

export const getAdminByID = asyncErrorHandler(async (req, res) => {
    const { adminId } = req.params;
	const admin = await adminService.getAdminByID(adminId);
	return res.status(200).json({
		status: "Success",
		message: "Admin retrieved",
		data: admin
	});
});

export const getAllUsers = asyncErrorHandler(async (req, res) => {
	const users = await adminService.getAllUsers();
	return res.status(200).json({
		status: "Success",
		message: "All users retrieved",
		data: users
	});
});

export const getAllClasses = asyncErrorHandler(async (req, res) => {
    const classes = await adminService.getAllClasses();
	return res.status(200).json({
		status: "Success",
		message: "All classes retrieved",
		data: classes
	});
});

// Export all controller methods
export default {
    getAdminByID,
    getAllUsers,
    getAllClasses
};
