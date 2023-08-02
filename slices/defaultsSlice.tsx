import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
export enum sides {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
  tTop = "tTop",
  tLeft = "tLeft",
  tRight = "tRight",
}

export interface DefaultsType {
  width: number;
  height: number;
  depth: number;
}
export interface DefaultsType1 {
  width: number;
  height: number;
  depth: number;
  nbSwimJet: number;
}
export interface DefaultsType2 {
  top: number;
  height: number;
  bottom: number;
}
export interface DefaultsType3 {
  width: number;
  theight: number;
  bheight: number;
  depth: number;
}
export interface Defaults {
  cyl: DefaultsType2;
  pool: DefaultsType;
  hottub: DefaultsType1;
  lshape: DefaultsType3;
}

const initialState: Defaults = {
  cyl: {
    top: 3,
    height: 1.5,
    bottom: 3,
  },
  pool: {
    width: 5,
    height: 1.5,
    depth: 3,
  },
  hottub: {
    width: 3,
    height: 1.5,
    depth: 3,
    nbSwimJet: 1,
  },
  lshape: {
    width: 4,
    theight: 16,
    bheight: 12,
    depth: 2,
  },
};

export const defaultsSlice = createSlice({
  name: "default",
  initialState,
  reducers: {
    setDefaultTopCyl: (state, action) => {
      state["cyl"].top = action.payload as number;
    },
    setDefaultWidthPool: (state, action) => {
      state["pool"].width = action.payload as number;
    },
    setDefaultHeightCyl: (state, action) => {
      state["cyl"].height = action.payload as number;
    },
    setDefaultHeightPool: (state, action) => {
      state["pool"].height = action.payload as number;
    },
    setDefaultBottomCyl: (state, action) => {
      state["cyl"].bottom = action.payload as number;
    },
    setDefaultDepthPool: (state, action) => {
      state["pool"].depth = action.payload as number;
    },
    setDefaultWidthHottub: (state, action) => {
      state["hottub"].width = action.payload as number;
    },
    setDefaultHeightHottub: (state, action) => {
      state["hottub"].height = action.payload as number;
    },
    setDefaultDepthHottub: (state, action) => {
      state["hottub"].depth = action.payload as number;
    },
    setDefaultNbSwimJetsHottub: (state, action) => {
      state["hottub"].nbSwimJet = action.payload as number;
    },
    setDefaultBHeightLShape: (state, action) => {
      state["lshape"].bheight = action.payload as number;
    },
    setDefaultDepthLShape: (state, action) => {
      state["lshape"].depth = action.payload as number;
    },
    setDefaultTHeightLShape: (state, action) => {
      state["lshape"].theight = action.payload as number;
    },
    setDefaultWidthLShape: (state, action) => {
      state["lshape"].width = action.payload as number;
    },
  },
});

export const {
  setDefaultBHeightLShape,
  setDefaultDepthLShape,
  setDefaultTHeightLShape,
  setDefaultWidthLShape,
  setDefaultTopCyl,
  setDefaultWidthPool,
  setDefaultHeightCyl,
  setDefaultHeightPool,
  setDefaultBottomCyl,
  setDefaultDepthPool,
  setDefaultHeightHottub,
  setDefaultDepthHottub,
  setDefaultWidthHottub,
  setDefaultNbSwimJetsHottub,
} = defaultsSlice.actions;
export const selectDefaultWidthCyl = (state: RootState) =>
  state.defaults.cyl.top;
export const selectDefaultWidthPool = (state: RootState) =>
  state.defaults.pool.width;
export const selectDefaultHeightCyl = (state: RootState) =>
  state.defaults.cyl.height;
export const selectDefaultHeightPool = (state: RootState) =>
  state.defaults.pool.height;
export const selectDefaultDepthCyl = (state: RootState) =>
  state.defaults.cyl.bottom;
export const selectDefaultDepthPool = (state: RootState) =>
  state.defaults.pool.depth;

export const selectDefaultWidthHottub = (state: RootState) =>
  state.defaults.hottub.width;
export const selectDefaultHeightHottub = (state: RootState) =>
  state.defaults.hottub.height;
export const selectDefaultDepthHottub = (state: RootState) =>
  state.defaults.hottub.depth;
export default defaultsSlice.reducer;
