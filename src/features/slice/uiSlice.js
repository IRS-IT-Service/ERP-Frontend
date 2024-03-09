import { ModeEditOutlineRounded } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Mode: false,
  ShowSide_nav: true,
  ToggleMenu: false,
  HeaderName: "",

  isInfoOpen: false,
  themeColor: localStorage.getItem("themeColor")
    ? JSON.parse(localStorage.getItem("themeColor"))
    : {
        name: "blue",
        themeColor1: "linear-gradient(0deg, #01127D, #04012F)",
        sideBarColor1: "#4459ee",
        sideBarColor2: "#b3cbff",
        textColor: "#fff",
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
    setHeader: (state, action) => {
      state.HeaderName = action.payload;
    },
    setInfo: (state, action) => {
      state.isInfoOpen = action.payload;
    },
  },
});

export const {
  toggleMode,
  toggleShowNav,
  Showmenu,
  setTheme,
  setHeader,
  setInfo,
} = uiSlice.actions;
export default uiSlice.reducer;
