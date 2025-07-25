import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DataState {
  id: string;
  titles: string;
  body: string;
  articles: string[];
  fontStyle: string[];
  fontWeight: string[];
  textDecoration: string[];
}

const initialState: DataState = {
  id: "",
  titles: "",
  body: "",
  articles: [],
  fontStyle: [],
  fontWeight: [],
  textDecoration: [],
};

const dataSlice = createSlice({
  name: "data_state",
  initialState,
  reducers: {
    addFontStyle: (state, action: PayloadAction<{ text: string }>) => {
      state.fontStyle.push(action.payload.text);
    },
    addFontWeight: (state, action: PayloadAction<{ text: string }>) => {
      state.fontWeight.push(action.payload.text);
    },
    addTextDecoration: (state, action: PayloadAction<{ text: string }>) => {
      state.textDecoration.push(action.payload.text);
    },
    deleteFontStyle: (state, action: PayloadAction<{ text: string }>) => {
      state.fontStyle = state.fontStyle.filter(
        (style) => style !== action.payload.text
      );
    },
    deleteFontWeight: (state, action: PayloadAction<{ text: string }>) => {
      state.fontWeight = state.fontWeight.filter(
        (weight) => weight !== action.payload.text
      );
    },
    deleteTextDecoration: (state, action: PayloadAction<{ text: string }>) => {
      state.textDecoration = state.textDecoration.filter(
        (decoration) => decoration !== action.payload.text
      );
    },
  },
});

export const {
  addFontStyle,
  addFontWeight,
  addTextDecoration,
  deleteFontStyle,
  deleteFontWeight,
  deleteTextDecoration,
} = dataSlice.actions;
export default dataSlice.reducer;
