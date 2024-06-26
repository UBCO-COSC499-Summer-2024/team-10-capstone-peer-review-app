import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Local storage
import sessionStorage from 'redux-persist/lib/storage/session'; // Session storage
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'; 

import userReducer from './hooks/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
