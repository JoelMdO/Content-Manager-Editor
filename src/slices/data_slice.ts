import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface DataState {
  id: string;
  titles: string;
  body: string;
  articles: string[];
  fontStyle: string[];
  fontWeight: string[];
}

const initialState: DataState = {
  id: "",
  titles: "",
  body: "",
  articles: [],
  fontStyle: [],
  fontWeight: [],
}

const dataSlice = createSlice({
  name: "data_state",
  initialState,
  reducers: {
    addId: (state, action: PayloadAction<{id:string}>) => {
      state.id = action.payload.id;
    },
    addTitle: (state, action: PayloadAction<{title: string}>) => {
      state.titles= action.payload.title;
    },  
    addBodyArticle: (state, action: PayloadAction<{body: string}>) => {
      state.body = action.payload.body;
    },
    addFontStyle: (state, action: PayloadAction<{text: string}>) => {
      state.fontStyle.push(action.payload.text);
    }, 
    addFontWeight: (state, action: PayloadAction<{text: string}>) => {
      state.fontWeight.push(action.payload.text);
    }, 
    deleteFontStyle: (state, action: PayloadAction<{text: string}>) => {
    state.fontStyle = state.fontStyle.filter(style => style !== action.payload.text);
    },
    deleteFontWeight: (state, action: PayloadAction<{text: string}>) => {
      state.fontWeight = state.fontWeight.filter(weight => weight !== action.payload.text);
    }
  }
});

export const { addId, addTitle, addBodyArticle, addFontStyle, addFontWeight, deleteFontStyle, deleteFontWeight} = dataSlice.actions;
export default dataSlice.reducer;