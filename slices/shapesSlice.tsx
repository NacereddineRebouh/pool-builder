import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export interface ShapesType {
    shapeType: string;
    position: number[];
    scale: number[];
}
interface ShapesState {
    shapes:ShapesType[]
    pools:ShapesType[]
}

const initialState: ShapesState = {
    shapes:[],
    pools:[]
};

export const shapeSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    addShape: (state, action) => {
      state.shapes.push(action.payload);
    },
    removeShapeByIndex: (state, action) => {
      state.shapes.splice(action.payload.index,1);
    },
    popShape: (state, action) => {
      state.shapes.pop();
    },
    addPool: (state, action) => {
      state.pools.push(action.payload);
    },
    removePoolByIndex: (state, action) => {
      state.pools.splice(action.payload.index,1);
    },
    popPool: (state, action) => {
      state.pools.pop();
    }
  },
});

export const { addShape, removeShapeByIndex, popShape, addPool, removePoolByIndex, popPool } = shapeSlice.actions;
export const selectShapes = (state: RootState) => state.shapes.shapes;
export const selectPools = (state: RootState) => state.shapes.pools;
export default shapeSlice.reducer;
