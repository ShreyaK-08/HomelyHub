//state manager
// all list properties 
//count
//serach filters,
//loading flag
//error

import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
    name :"property",
    initialState:{
        properties:[],
        totalProperties: 0,
        searchParams:{},
        error:null,
        loading : false
    },
    reducers:{
        getRequest(state){
            state.loading = true;
        },
        getProperties(state,action){
            state.properties = action.payload.data;
            state.totalProperties = action.payload.all_properties;
            state.loading=false; // req finished => hide the loader
        },
        updateSearchParams:(state,action)=>{
            if (!action.payload || Object.keys(action.payload).length === 0) {
                state.searchParams = {};
            } else {
                state.searchParams = {
                    ...state.searchParams,
                    ...action.payload
                };
            }
        },
        resetFilters:(state)=>{
            // Retain search destination/guests/dates if present, clear filter modal parameters
            const { city, guests, dateIn, dateOut } = state.searchParams;
            state.searchParams = {
                ...(city ? { city } : {}),
                ...(guests ? { guests } : {}),
                ...(dateIn ? { dateIn } : {}),
                ...(dateOut ? { dateOut } : {}),
                page: 1,
            };
        },
        getErrors(state,action){
            state.error = action.payload
        }

    }

})

export const propertyAction = propertySlice.actions

export default propertySlice;