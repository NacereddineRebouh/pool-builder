import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface HelperState {
  dragging: boolean;
  mouseDown?: boolean;
  type: string;
}

const initialState: HelperState = {
  dragging: false,
  mouseDown: false,
  type: ""
};

export const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    setDragging: (state, action) => {
      state.dragging = action.payload.dragging;
    },
    setMouseDown: (state, action) => {
      state.mouseDown = action.payload.mouseDown;
    },
    setHelper: (state, action) => {
      state.dragging = action.payload.dragging;
      state.mouseDown = action.payload.mouseDown!=undefined? action.payload.mouseDown: state.mouseDown;
      state.type = action.payload.type !=undefined? action.payload.type: state.type;
    },
  },
});

export const { setDragging, setHelper, setMouseDown } = helperSlice.actions;
export const selectDragging = (state: RootState) => state.helper.dragging;
export const selectMouseDown = (state: RootState) => state.helper.mouseDown;
export const selectHelper = (state: RootState) => state.helper;
export default helperSlice.reducer;
