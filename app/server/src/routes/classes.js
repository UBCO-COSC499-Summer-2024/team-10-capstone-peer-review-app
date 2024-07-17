import express from "express";
import {
	getClassesByInstructor,
	getInstructorByClass,
	getClassById,
	getAllClasses,
	getAllClassesUserIsNotIn, 
	createClass,
	updateClass,
	deleteClass,
	addStudentToClass,
	addStudentsByEmail,
	removeStudentFromClass,
	getStudentsByClass,
	addGroupToClass,
	removeGroupFromClass,
	updateGroupInClass,
	getGroupInClass,
	getGroupsInClass,
	getGroupMembers,
	addGroupMember,
	removeGroupMember,
	joinGroup,
	leaveGroup,
	isUserInGroup,
	getStudentsNotInAnyGroup,
	getCategoriesByClassId
} from "../controllers/classController.js";

import {
	ensureUser,
	ensureInstructor,
	ensureAdmin,
	ensureInstructorOrAdmin
} from "../middleware/ensureUserTypes.js";

const router = express.Router();

// Class Routes
router.route("/all").get(ensureUser, getAllClasses);

router
	.route("/my-classes")
	.get(ensureUser, ensureInstructor, getClassesByInstructor);

router.route("/not-enrolled").get(ensureUser, getAllClassesUserIsNotIn);

router.route("/create").post(ensureUser, ensureInstructorOrAdmin, createClass);

router
	.route("/:classId")
	.get(ensureUser, getClassById)
	.put(ensureUser, ensureInstructorOrAdmin, updateClass)
	.delete(ensureUser, ensureInstructorOrAdmin, deleteClass);

router.route("/:classId/students").get(ensureUser, getStudentsByClass);
router.route("/:classId/instructor").get(ensureUser, getInstructorByClass);

// Student Routes
router
	.route("/add-student")
	.post(ensureUser, ensureInstructorOrAdmin, addStudentToClass);

router
	.route("/add-students-by-email")
	.post(ensureUser, ensureInstructorOrAdmin, addStudentsByEmail);

router
	.route("/remove-student")
	.post(ensureUser, ensureInstructorOrAdmin, removeStudentFromClass);

router.route("/add-group").post(ensureUser, addGroupToClass);

router
	.route("/remove-group")
	.post(ensureUser, ensureInstructorOrAdmin, removeGroupFromClass);

router.route("/join-group").post(ensureUser, joinGroup);

router.route("/leave-group").post(ensureUser, leaveGroup);

router
	.route("/update-group")
	.post(ensureUser, ensureInstructorOrAdmin, updateGroupInClass);

router
	.route("/get-group")
	.post(ensureUser, ensureInstructorOrAdmin, getGroupInClass);

router.route("/get-groups").post(ensureUser, getGroupsInClass);

router
	.route("/get-group-members")
	.post(ensureUser, ensureInstructor, getGroupMembers);

router
	.route("/add-group-member")
	.post(ensureUser, ensureInstructor, addGroupMember);

router
	.route("/remove-group-member")
	.post(ensureUser, ensureInstructor, removeGroupMember);

router
	.route("/is-user-in-group")
	.post(ensureUser, ensureInstructorOrAdmin, isUserInGroup);
router
	.route("/users-not-in-groups")
	.post(ensureUser, ensureInstructorOrAdmin, getStudentsNotInAnyGroup);

router.route("/:classId/categories").get(ensureUser, getCategoriesByClassId);

export default router;
