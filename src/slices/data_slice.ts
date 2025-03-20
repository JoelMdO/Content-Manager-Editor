import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { title } from 'process';


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
      console.log('id after', state.id);
    },
    addTitle: (state, action: PayloadAction<{title: string}>) => {
      console.log('titles before', state.titles);
      state.titles= action.payload.title;
      console.log('titles after', state.titles);
    },  
    addBodyArticle: (state, action: PayloadAction<{body: string}>) => {
      state.body = action.payload.body;
      console.log('body', state.body);
    },
    addFontStyle: (state, action: PayloadAction<{text: string}>) => {
      state.fontStyle.push(action.payload.text);
      console.log('fontStyle', state.fontStyle);
    }, 
    addFontWeight: (state, action: PayloadAction<{text: string}>) => {
      state.fontWeight.push(action.payload.text);
      console.log('fontWeight', state.fontWeight);
    }, 
    deleteFontStyle: (state, action: PayloadAction<{text: string}>) => {
    state.fontStyle = state.fontStyle.filter(style => style !== action.payload.text);
    console.log('fontStyle deleted', state.fontStyle);
    },
    deleteFontWeight: (state, action: PayloadAction<{text: string}>) => {
      state.fontWeight = state.fontWeight.filter(weight => weight !== action.payload.text);
      console.log('fontWeight deleted', state.fontWeight);
    }
  }
});

export const { addId, addTitle, addBodyArticle, addFontStyle, addFontWeight, deleteFontStyle, deleteFontWeight} = dataSlice.actions;
export default dataSlice.reducer;