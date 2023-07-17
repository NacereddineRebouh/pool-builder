import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}

export interface DefaultsType {
    width: number;
    height: number;
    depth: number;
}
export interface DefaultsType2 {
    top: number;
    height: number;
    bottom: number;
}
export interface Defaults {
    cyl:DefaultsType2;
    pool:DefaultsType;
}

const initialState: Defaults = {
    cyl:{
      top: 6,
      height: 5,
      bottom: 6,},
    pool:{
      width: 16,
      height: 5,
      depth: 12,}  
};

export const defaultsSlice = createSlice({
  name: "default",
  initialState,
  reducers: {
    setDefaultTopCyl: (state, action) => {
      state["cyl"].top=action.payload as number;
    },
    setDefaultWidthPool: (state, action) => {
      state["pool"].width=action.payload as number;
    },
    setDefaultHeightCyl: (state, action) => {
      state["cyl"].height=action.payload as number;
    },
    setDefaultHeightPool: (state, action) => {
      state["pool"].height=action.payload as number;
    },
    setDefaultBottomCyl: (state, action) => {
      state["cyl"].bottom=action.payload as number;
    },
    setDefaultDepthPool: (state, action) => {
      state["pool"].depth=action.payload as number;
    },

  },
});

export const { setDefaultTopCyl,setDefaultWidthPool, setDefaultHeightCyl, setDefaultHeightPool, setDefaultBottomCyl, setDefaultDepthPool } = defaultsSlice.actions;
export const selectDefaultWidthCyl = (state: RootState) => state.defaults.cyl.top;
export const selectDefaultWidthPool = (state: RootState) => state.defaults.pool.width;
export const selectDefaultHeightCyl = (state: RootState) => state.defaults.cyl.height;
export const selectDefaultHeightPool = (state: RootState) => state.defaults.pool.height;
export const selectDefaultDepthCyl = (state: RootState) => state.defaults.cyl.bottom;
export const selectDefaultDepthPool = (state: RootState) => state.defaults.pool.depth;
export default defaultsSlice.reducer;
