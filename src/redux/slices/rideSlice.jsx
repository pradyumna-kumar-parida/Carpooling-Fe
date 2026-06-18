import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  source: null,
  destination: null,
  time: null,
  date: null,
  price: null,
};
const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {},
});
