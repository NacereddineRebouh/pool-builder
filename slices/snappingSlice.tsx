import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface snapPositionSlice {
  x: number;
  y: number;
  z: number;
}

const initialState: snapPositionSlice = {
    x: 0,
    y: 0,
    z: 0,
};

export const SnapPositionSlice = createSlice({
  name: "snapPosition",
  initialState,
  reducers: {
    setSnappingPosition: (state, action) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
      state.z = action.payload.z;
    },
  },
});

export const { setSnappingPosition } = SnapPositionSlice.actions;
export const selectSnappingPosition = (state: RootState) => state.snapPosition;
export default SnapPositionSlice.reducer;
