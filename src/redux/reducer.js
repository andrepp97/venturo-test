import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const keranjangReducer = createSlice({
    name: "keranjang",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const itemIndex = state.findIndex(item => item.id === action.payload.id);
            if (itemIndex !== -1) {
                return state.map((item, i) => ({
                    ...item,
                    qty: item.qty + (itemIndex === i ? 1 : 0),
                }));
            } else {
                state.push(action.payload);
                return state;
            }
        },

        decreaseQty: (state, action) => {
            const itemIndex = state.findIndex(item => item.id === action.payload.id);
            if (itemIndex !== -1) {
                return state.map((item, i) => ({
                    ...item,
                    qty: item.qty - (itemIndex === i ? 1 : 0),
                }));
            }
        },

        removeItem: (state, action) => {
            let temp = [...state];
            temp = temp.filter(item => item.id !== action.payload);
            return temp;
        },

        updateItem: (state, action) => {
            const itemIndex = state.findIndex(item => item.id === action.payload.id);
            if (itemIndex !== -1) {
                return state.map((item, i) => ({
                    ...item,
                    catatan: itemIndex === i ? action.payload.catatan : '',
                }));
            }
        },
    },

});

export const {
    addItem,
    decreaseQty,
    removeItem,
    updateItem,
} = keranjangReducer.actions;
export const reducer = keranjangReducer.reducer;