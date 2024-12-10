import { createSlice } from "@reduxjs/toolkit";
export interface Space_{
  id:string,
  name:string,
  thumbnail:string|null,
  dimensions:string,
}
export interface State_{
  name:string|null;
  selectSpaceId:string;
  token: string | null;
  role: string | null;
  type:string|null;
  avatarId: string | undefined;
  spaces: Space_[]; 
  avatars: any[];
  change:number;
}
const initialState: State_ = {
  name:null,
  selectSpaceId:'',
  type:null,
  change:1,
  token: null,
  role: null,
  avatarId: undefined,
  spaces: [], 
  avatars: [],
};


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setType:(state)=>{
      state.type="Not-Google";
      console.log(state.type);
    },
    setChange:(state)=>{
      state.change+=1;
    },
    setSpaceId:(state,action)=>{
      state.selectSpaceId=action.payload.spaceId;
    },
    setName:(state,action)=>{
      state.name=action.payload.name;
    },
    setAvatarId:(state,action)=>{
      state.avatarId=action.payload.avatarId || undefined;
    },
    setRole:(state,action)=>{
      state.role=action.payload.role;
    },
    setSpaces:(state,action)=>{
      state.spaces=action.payload.spaces;
    },
    setLogin: (state, action) => {
      // state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setAvatar:(state,action)=>{
      state.avatars=action.payload.avatar;
    },
    setLogout: (state) => {
      state.token = null;
    },
    setUpdateSpaces: (state, action) => {
      const updatedSpace = state.spaces.map((space) => {
        if (space.id === action.payload.space.id) return action.payload.space;
        return space;
      });
      state.spaces = updatedSpace;
    },

  },
});

export const {setSpaceId,setType,setLogin,setRole,setChange, setLogout,setAvatar,setAvatarId,setSpaces,setUpdateSpaces,setName} =
  authSlice.actions;
export default authSlice.reducer;