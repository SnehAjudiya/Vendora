import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  category: string[];
  subcategory: string[];
};

const initialState: FilterState = {
  category: [],
  subcategory: [],
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<string>) => {
      const index = state.category.findIndex((c) => c === action.payload);
      if (index === -1) state.category.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.category = state.category.filter((c) => c !== action.payload);
    },
    addSubCategory: (state, action: PayloadAction<string>) => {
      const index = state.subcategory.findIndex((c) => c === action.payload);
      if (index === -1) state.subcategory.push(action.payload);
    },
    removeSubCategory: (state, action: PayloadAction<string>) => {
      state.subcategory = state.subcategory.filter((c) => c !== action.payload);
    },
    removeAll: (state) => {
      state.category = [];
      state.subcategory = [];
    },
  },
});

export const {
  addCategory,
  removeCategory,
  addSubCategory,
  removeSubCategory,
  removeAll,
} = filterSlice.actions;
export default filterSlice.reducer;
