import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface PointerSlice {
  x: number;
  y: number;
  z: number;
}

const initialState: PointerSlice = {
    x: 0,
    y: 0,
    z: 0,
};

export const pointerSlice = createSlice({
  name: "pointer",
  initialState,
  reducers: {
    setPointer: (state, action) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
      state.z = action.payload.z;
    },
  },
});

export const { setPointer } = pointerSlice.actions;
export const selectPointer = (state: RootState) => state.pointer;
export default pointerSlice.reducer;
