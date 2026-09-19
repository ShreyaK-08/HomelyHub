import {createSlice} from "@reduxjs/toolkit"


const userSlice = createSlice({
    name: "user",
    initialState:{
        isAuthenticated:false,
        loading:false,
        user:null,
        errors:null,
        success:false,
        authChecked:false
    },
    reducers:{
        getSignupRequest(state){
            state.loading=true;
        },
        getSignupDetails(state,action){
            state.user=action.payload;
            state.isAuthenticated=true;
            state.loading=false;
            state.authChecked=true;
        },
        getLoginRequest(state){
            state.loading=true;
        },
        getLoginDetails(state,action){
            state.user=action.payload;
            state.isAuthenticated=true;
            state.loading=false;
            state.authChecked=true;
        },
        getError(state,action){
            state.errors=action.payload;
            state.loading=false;
        },
        getCurrentRequest(state){
            state.loading= true;
        },
        getUpdateUserRequest(state){
            state.loading=true;
        },
        getCurrentUser(state,action){
            state.user=action.payload;
            state.isAuthenticated=true;
            state.loading=false;
            state.authChecked=true;
        },
        getLogoutRequest(state){
            state.loading=true;
        },
        getLogout(state,action){
            state.user=action.payload;
            state.isAuthenticated=false;
            state.loading=false;
            state.authChecked=true;
        },
        getPasswordRequest(state){
            state.loading=true
        },
        getPasswordSuccess(state,action){
            state.success= action.payload;
            state.loading=false
        },
        clearErrors(state){
            state.errors = null;
        }

    }
})

export const userActions = userSlice.actions;
export default userSlice;