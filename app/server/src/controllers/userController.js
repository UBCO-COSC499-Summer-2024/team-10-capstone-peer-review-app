import { getUserClasses as getUserClassesService, getUserAssignments as getUserAssignmentsService } from "../services/userService.js";

export async function getUserClasses(req, res, next) {
  try {
    console.log("getUserClasses endpoint hit");
    const userId = req.body.userId;
    const classes = await getUserClassesService(userId);
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
}

export async function getUserAssignments(req, res, next) {
  try {
    console.log("getUserAssignments endpoint hit");
    const userId = req.body.userId;
    const assignments = await getUserAssignmentsService(userId);
    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
}

export default {
  getUserClasses,
  getUserAssignments,
};
