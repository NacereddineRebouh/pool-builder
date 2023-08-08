import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface PropertiesSlice {
  UseInches: boolean;
}

const initialState: PropertiesSlice = {
  UseInches: false,
};

export const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setUseInches: (state, action) => {
      state.UseInches = action.payload;
    },
  },
});

export const { setUseInches } = propertiesSlice.actions;
export default propertiesSlice.reducer;
