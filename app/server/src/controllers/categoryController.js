import express from "express";
import categoryService from "../services/categoryServices.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
//import { user } from "../../../../../../../node_modules/pg/lib/defaults.js";


// Controller methods for category operations
export const getAllCategoriesInClass = asyncErrorHandler(async (req, res) => {
    const { classId } = req.body;
    const categories = await categoryService.getAllCategories(classId);
    return res.status(200).json({
        status: "Success",
        message: "Retrieved all categories in class",
        data: categories
    });
});

export const createCategory = asyncErrorHandler(async (req, res) => {
    const { classId, name } = req.body;
    const newCategory = await categoryService.createCategory(classId, name);
    return res.status(201).json({
        status: "Success",
        message: "Category created",
        data: newCategory
    });
});

export const updateCategory = asyncErrorHandler(async (req, res) => {
    const {categoryId, name } = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryId, name);
    return res.status(200).json({
        status: "Success",
        message: "Category updated",
        data: updatedCategory
    });
});

export const deleteCategory = asyncErrorHandler(async (req, res) => {
    const categoryId = req.body.categoryId;
    await categoryService.deleteCategory(categoryId);
    return res.status(200).json({
        status: "Success",
        message: "Category deleted"
    });
});

export const getCategoryAssignments = asyncErrorHandler(async (req, res) => {
    const categoryId = req.body.categoryId;
    const assignments = await categoryService.getCategoryAssignments(categoryId);
    return res.status(200).json({
        status: "Success",
        message: "Retrieved category assignments",
        data: assignments
    });
});

export const addAssignmentToCategory = asyncErrorHandler(async (req, res) => {
    const { categoryId, assignmentId } = req.body;
    const updatedCategory = await categoryService.addAssignmentToCategory(categoryId, assignmentId);
    return res.status(200).json({
        status: "Success",
        message: "Assignment added to category",
        data: updatedCategory
    });
});

export const deleteAssignmentFromCategory = asyncErrorHandler(async (req, res) => {
    const { categoryId, assignmentId } = req.body;
    const updatedCategory = await categoryService.deleteAssignmentFromCategory(categoryId, assignmentId);
    return res.status(200).json({
        status: "Success",
        message: "Assignment deleted from category",
        data: updatedCategory
    });
});

export default {
    getAllCategoriesInClass,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryAssignments,
    addAssignmentToCategory,
    deleteAssignmentFromCategory 
};
