import {configureStore} from '@reduxjs/toolkit';
import {stateReducer} from "./state";

export const ZARA_PRODUCT_CHECKER_STATE = 'ZARA_PRODUCT_CHECKER_STATE';
const storedState = localStorage.getItem(ZARA_PRODUCT_CHECKER_STATE);
const persistedState = storedState ? JSON.parse(storedState) : {}

export const store = configureStore({
    reducer: {
        appState: stateReducer,
    },
    preloadedState: persistedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});

store.subscribe(() => {
    localStorage.setItem(ZARA_PRODUCT_CHECKER_STATE, JSON.stringify(store.getState()))
})

export type RootState = ReturnType<typeof store.getState>;
