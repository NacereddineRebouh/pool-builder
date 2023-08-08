import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Object3D } from "three";

interface TargetState {
  target: Object3D|null;
  targetTitle: string;
  pivotVisibility: boolean
}

const initialState: TargetState = {
    target: null,
    targetTitle: '',
    pivotVisibility: false
};

export const targetSlice = createSlice({
  name: "target",
  initialState,
  reducers: {
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setPivotVisibility: (state, action) => {
      state.pivotVisibility = action.payload;
    },
    setTargetTitle: (state, action) => {
      state.targetTitle = action.payload;
    },
  },
});

export const { setTarget, setTargetTitle, setPivotVisibility } = targetSlice.actions;
export const selectTarget = (state: RootState) => state.target.target;
export const selectPivotVisibility = (state: RootState) => state.target.pivotVisibility;
export default targetSlice.reducer;
