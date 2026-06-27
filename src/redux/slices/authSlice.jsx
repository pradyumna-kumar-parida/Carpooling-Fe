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
      state.user = action.payload.userData
        ? action.payload.userData
        : action.payload;

      state.token = action.payload.token ?? null;
      state.role = action.payload.role ?? action.payload.userData?.role ?? null;

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
