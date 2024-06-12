import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import classReducer from './slices/classSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    classes: classReducer,
  },
});

export default store;