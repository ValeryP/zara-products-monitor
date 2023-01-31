import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../models/Product";

export type State = {
    products: Product[];
}

export const INITIAL_STATE: State = {
    products: []
};

export const stateSlice = createSlice({
    name: "appState",
    initialState: INITIAL_STATE,
    reducers: {
        updateState: (state, action: PayloadAction<State>) => {
            return {...state, ...action.payload}; // return the entire modified state
        }
    }
});

export const {updateState} = stateSlice.actions;

export const stateReducer = stateSlice.reducer;
