import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}
export interface ChildrensType {
    shapeType: string;
    position: number[];
    sPosition: number[];
    FollowPosition: number[];
    sRotation: number[];
    rotation: number[];
    scale: number[];
    sScale: number[];
    width: number;
    sWidth: number;
    height: number;
    sHeight: number;
    depth: number;
    sDepth: number;
    side: sides;
}
export interface PoolType {
    poolType: string;
    position: number[];
    sPosition: number[];
    FollowPosition: number[];
    sRotation: number[];
    rotation: number[];
    scale: number[];
    sScale: number[];
    width: number;
    sWidth: number;
    height: number;
    sHeight: number;
    depth: number;
    sDepth: number;
    childrens:ChildrensType[]
}
interface PoolsState {
    pools:PoolType[]
}

const initialState: PoolsState = {
    pools:[]
};

export const PoolsSlice = createSlice({
  name: "Pools",
  initialState,
  reducers: {
    addPool: (state, action) => {
      state.pools.push(action.payload);
    },
    removePoolByIndex: (state, action) => {
      state.pools.splice(action.payload.index,1);
    },
    popPool: (state, action) => {
      state.pools.pop();
    },
    ReplacePool: (state, action) => {
      state.pools[action.payload.poolIndex]=action.payload.pool;
    },
    addChildren: (state, action) => {
      state.pools[action.payload.poolIndex].childrens.push(action.payload.children);
    },
    ReplaceChildren: (state, action) => {
      state.pools[action.payload.poolIndex].childrens[action.payload.modelIndex]=action.payload.model;
    },
    removeChildrenByIndex: (state, action) => {
      state.pools[action.payload.poolIndex].childrens.splice(action.payload.index,1)
    },
    popChildren: (state, action) => {
      state.pools[action.payload.poolIndex].childrens.pop();
    }
  },
});

export const { addChildren,ReplacePool, ReplaceChildren, removeChildrenByIndex, popChildren, addPool, removePoolByIndex, popPool } = PoolsSlice.actions;
export const selectPools = (state: RootState) => state.pools.pools;
export const selectPool = (state: RootState, poolIndex:number) => state.pools.pools[poolIndex];
export const selectModel = (state: RootState, poolIndex:number,modelIndex:number) => state.pools.pools[poolIndex].childrens[modelIndex];
export const selectModels = (state: RootState,index:number) => state.pools.pools[index].childrens;
export default PoolsSlice.reducer;
