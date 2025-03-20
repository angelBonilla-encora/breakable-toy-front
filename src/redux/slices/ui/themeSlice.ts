import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  themeToggle: boolean;
}

const initialState: ThemeState = {
  themeToggle: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    themeToggle: (state) => {
      state.themeToggle = !state.themeToggle;
    },
  },
});

export const { themeToggle } = themeSlice.actions;
