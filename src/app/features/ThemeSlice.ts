import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type ThemeMode = 'light' | 'dark';

interface ThemeState {
    theme: ThemeMode;
}

const  initialState: ThemeState = {
        theme: 'light',
        };

export const themeSlice = createSlice({
        name: "theme",
        initialState,
        reducers: {
                setTheme: (state, action:PayloadAction<ThemeMode>) => {
                        state.theme = action.payload;
                },
                toggleTheme: (state) => {
                        state.theme = state.theme === 'light' ? 'dark' : 'light';
                },
        },
})

export const {setTheme, toggleTheme} = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.theme;
export default themeSlice.reducer;