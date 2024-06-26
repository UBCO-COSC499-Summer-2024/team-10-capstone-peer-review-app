// src/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setCurrentUser: (state, action) => {
			state.currentUser = action.payload;
		},
		updateUser: (state, action) => {
			state.currentUser = { ...state.currentUser, ...action.payload };
		}
	}
});

export const { setCurrentUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
