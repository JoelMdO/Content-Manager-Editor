import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LinkState {
  links: Array<string>[];
}

const initialState: LinkState = {
  links: [],
};

const linkSlice = createSlice({
  name: "links_state",
  initialState,
  reducers: {
    addLink: (state, action: PayloadAction<string[]>) => {
      state.links.push(action.payload);
    },
    removeLink: (state, action: PayloadAction<number>) => {
      state.links.splice(action.payload, 1);
    },
    clearLinks: (state) => {
      state.links = [];
    },
  },
});


export const { addLink, removeLink, clearLinks } = linkSlice.actions;
export default linkSlice.reducer;