import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVehicleListApi } from "../../services/vehicleService";

export const fetchVehicleList = createAsyncThunk(
  "vehicle/fetchVehicleList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVehicleListApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch vehicles",
      );
    }
  },
);

const initialState = {
  vehicleList: [],
  selectedVehicle: null,
  loading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,

  reducers: {
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },

    clearSelectedVehicle: (state) => {
      state.selectedVehicle = null;
    },

    clearVehicleList: (state) => {
      state.vehicleList = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVehicleList.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleList = action.payload;
      })

      .addCase(fetchVehicleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedVehicle, clearSelectedVehicle, clearVehicleList } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
