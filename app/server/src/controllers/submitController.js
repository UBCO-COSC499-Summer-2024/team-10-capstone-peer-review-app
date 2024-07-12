// submitController.js
import submitService from "../services/submitService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/submissions/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

export const createSubmission = [
  upload.single('file'),
  asyncErrorHandler(async (req, res) => {
    console.log(req.user, req.body, req.file);
    const studentId = req.body.studentId;
    const assignmentId = req.body.assignmentId;
    const submissionFilePath = req.file ? req.file.path : null;

    if (!submissionFilePath) {
      return res.status(400).json({
        status: "Error",
        message: "No file uploaded"
      });
    }

    const newSubmission = await submitService.createSubmission(studentId, assignmentId, submissionFilePath);
    return res.status(200).json({
      status: "Success",
      data: newSubmission
    });
  })
];


export const getStudentSubmission = asyncErrorHandler(async (req, res) => {
    const studentId = req.user.userId;
    const studentData = await submitService.getStudentSubmission(studentId);
    return res.status(200).json({
        status: "Success",
        data: studentData
    });
});

export const getSubmissionsForAssignment = asyncErrorHandler(async (req, res) => {
    const assignmentId = req.body.assignmentId;
    const assignmentData = await submitService.getSubmissionsForAssignment(assignmentId);
    return res.status(200).json({
        status: "Success",
        data: assignmentData
    });
});


export const updateSubmission = asyncErrorHandler(async (req, res) => {
    const {submissionId, submission} = req.body;
    const updatedSubmission = await submitService.updateSubmission(submissionId, submission);
    return res.status(200).json({
        status: "Success",
        data: updatedSubmission
    });
});

export const deleteSubmission = asyncErrorHandler(async (req, res) => {
    const submissionId = req.body.submissionId;
    const deletedSubmission = await submitService.deleteSubmission(submissionId);
    return res.status(200).json({
        status: "Success",
        data: deletedSubmission
    });
});


// Export all controller methods
export default {
    getStudentSubmission,
    getSubmissionsForAssignment,
    createSubmission,
    updateSubmission,
    deleteSubmission
};
