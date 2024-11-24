import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  spaces: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setSpaces:(state,action)=>{
      state.spaces=action.payload.spaces
    }

  },
});

export const {setLogin, setLogout} =
  authSlice.actions;
export default authSlice.reducer;