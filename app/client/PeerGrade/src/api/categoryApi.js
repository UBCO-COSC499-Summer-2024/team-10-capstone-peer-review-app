// This code provides a set of API functions to handle category management functionalities within a class. 
// The functionalities include:

// 1. createCategory: Creates a new category within a specified class.
// 2. getAllCategoriesInClass: Retrieves all categories within a specified class.
// 3. updateCategory: Updates the name of an existing category by its ID.
// 4. deleteCategory: Deletes a category by its ID.

// Each function handles API calls using axios and throws errors with appropriate messages if the calls fail.

import axios from 'axios';

const BASE_URL = "/api";

export const createCategory = async (classId, name) => {
  try {
    const response = await axios.post(`${BASE_URL}/category/createCategory`, { classId, name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error creating category');
  }
};

export const getAllCategoriesInClass = async (classId) => {
  try {
    const response = await axios.post(`${BASE_URL}/category/allCategories`, { classId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error fetching categories');
  }
};

export const updateCategory = async (categoryId, name) => {
  try {
    const response = await axios.post(`${BASE_URL}/category/updateCategory`, { categoryId, name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error updating category');
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/category/deleteCategory`, { 
      data: { categoryId } 
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error deleting category');
  }
};

// Add other category-related API calls here as needed