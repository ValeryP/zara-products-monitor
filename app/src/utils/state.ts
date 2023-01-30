import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type State = {
    url: string | null;
}

export const INITIAL_STATE: State = {
    url: null,
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
