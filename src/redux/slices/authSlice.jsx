import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const { token, userData } = action.payload;
      state.user = userData;
      state.token = token;
      state.role = userData.role;
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
