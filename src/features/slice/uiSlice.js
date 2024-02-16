import { ModeEditOutlineRounded } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Mode: false,
  ShowSide_nav: true,
  ToggleMenu: false,
  themeColor: localStorage.getItem("themeColor")
    ? JSON.parse(localStorage.getItem("themeColor"))
    : {
        name: "blue",
        themeColor1: "linear-gradient(0deg, #01127D, #04012F)",
      },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.Mode = !state.Mode;
    },
    toggleShowNav: (state) => {
      state.ShowSide_nav = !state.ShowSide_nav;
    },
    Showmenu: (state) => {
      state.ToggleMenu = !state.ToggleMenu;
    },

    setTheme: (state, actions) => {
      state.themeColor = actions.payload;
      localStorage.setItem("themeColor", JSON.stringify(actions.payload));
    },

    
  },
});

export const { toggleMode, toggleShowNav, Showmenu, setTheme } =
  uiSlice.actions;
export default uiSlice.reducer;
