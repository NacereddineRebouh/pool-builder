import defaultsSlice from "@/slices/defaultsSlice";
import helperSlice from "@/slices/helperSlice";
import pointerSlice from "@/slices/pointerSlice";
import poolsSlice from "@/slices/poolsSlice";
import shapesSlice from "@/slices/shapesSlice";
import snappingSlice from "@/slices/snappingSlice";
import targetSlice from "@/slices/targetSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    helper:helperSlice,
    pointer:pointerSlice,
    snapPosition:snappingSlice,
    pools:poolsSlice,
    shapes:shapesSlice,
    target:targetSlice,
    defaults:defaultsSlice
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
