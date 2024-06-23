import { getUserClasses as getUserClassesService } from "../services/userService.js";

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

export default {
  getUserClasses,
};
