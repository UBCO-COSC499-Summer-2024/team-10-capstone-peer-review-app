// src/api/categoryApi.js

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