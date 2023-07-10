import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export interface ChildrensType {
    shapeType: string;
    position: number[];
    scale: number[];
    width: number;
    height: number;
    depth: number;
}
export interface PoolType {
    poolType: string;
    position: number[];
    scale: number[];
    width: number;
    height: number;
    depth: number;
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
    addChildren: (state, action) => {
      state.pools[action.payload.poolIndex].childrens.push(action.payload.children);
    },
    removeChildrenByIndex: (state, action) => {
      state.pools[action.payload.poolIndex].childrens.splice(action.payload.index,1)
    },
    popChildren: (state, action) => {
      state.pools[action.payload.poolIndex].childrens.pop();
    }
  },
});

export const { addChildren, removeChildrenByIndex, popChildren, addPool, removePoolByIndex, popPool } = PoolsSlice.actions;
export const selectPools = (state: RootState) => state.pools.pools;
export const selectChildrens = (state: RootState,index:number) => state.pools.pools[index].childrens;
export default PoolsSlice.reducer;
