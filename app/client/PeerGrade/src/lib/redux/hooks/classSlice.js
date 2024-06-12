import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    addClass: (state, action) => {
      state.push(action.payload);
    },
    deleteClass: (state, action) => {
      return state.filter(classItem => classItem.class_id !== action.payload);
    },
  },
});

export const { addClass, deleteClass } = classSlice.actions;
export default classSlice.reducer;