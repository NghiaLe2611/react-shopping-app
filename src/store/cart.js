import { createSlice, current } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        finalItems: [],
        totalQuantity: 0,
        totalPrice: 0,
        isShowCart: false
    },

    reducers: {
        updateCartItems(state, action) {
            const payload = action.payload;
            state.finalItems = payload.updatedItems;
            state.totalQuantity = payload.updatedItems.length;
            state.totalPrice = state.finalItems.reduce( (curr, item) => { return curr + item.totalPrice; }, 0);
        },
        confirmChooseCart(state, action) {
            const payload = action.payload;
            // console.log(payload);

            switch (payload.type) {
                case 'ADD': {
                    state.finalItems.push(payload.item);
                    state.totalPrice += payload.item.totalPrice;
                    break;
                }
                case 'REMOVE': {
                    const updatedItem = payload.item;
                    state.finalItems = state.finalItems.filter(val => val._id !== updatedItem._id);
                    
                    if (state.totalPrice > 0) {
                        state.totalPrice -= updatedItem.totalPrice;
                    }
                    break;
                }
                case 'INCREASE': {
                    const finalItemIndex = state.finalItems.findIndex(val => val._id === payload.item._id);
                    state.finalItems[finalItemIndex] = payload.item;
                    state.totalPrice += payload.item.price;
                    // state.totalPrice = state.finalItems.reduce( (curr, item) => { return curr + item.totalPrice; }, 0);
                    break;
                } 
                case 'DECREASE': {                   
                    const finalItemIndex = state.finalItems.findIndex(val => val._id === payload.item._id);
                    state.finalItems[finalItemIndex] = payload.item;
                    state.totalPrice -= payload.item.price;
                    // state.totalPrice = state.finalItems.reduce( (curr, item) => { return curr + item.totalPrice; }, 0);
                    break;
                } 
                case 'CHANGE': {
                    const finalItemIndex = state.finalItems.findIndex(val => val._id === payload.item._id);
                    const itemIndex = state.items.findIndex(val => val._id === payload.item._id);
                    state.finalItems[finalItemIndex] = state.items[itemIndex];
                    state.totalPrice = state.finalItems.reduce( (curr, item) => { return curr + item.totalPrice; }, 0);
                    break;
                }
                case 'CLEAR': {
                    state.finalItems = [];
                    state.totalPrice = 0;
                    break;
                }
                default:
            }
        },
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item._id === newItem._id);

            const addNewItemHandler = () => {
                state.items.push({
                    _id: newItem._id,
                    category: newItem.category,
                    img: newItem.img,
                    name: newItem.name,
                    quantity: newItem.quantity, 
                    price: newItem.price, 
                    totalPrice: newItem.price,
                    sale: newItem.sale,
                    color: newItem.color
                });
                state.totalQuantity++;
            }

            if (!existingItem) {
                addNewItemHandler();
            } else {
                if (newItem.color) {
                    if (newItem.color === existingItem.color) {
                        existingItem.quantity++;
                        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
                    } else {
                        addNewItemHandler();
                    }
                } else {
                    existingItem.quantity++;
                    existingItem.totalPrice = existingItem.totalPrice + newItem.price;
                }
            }
        },
        changeQuantity(state, action) {
            const existingItem = state.items.find(item => item._id === action.payload._id);
            existingItem.quantity = action.payload.quantity;
            existingItem.totalPrice = existingItem.price * existingItem.quantity;
        },
        decreaseCartQuantity(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item._id === id);

            if (existingItem.quantity === 1) {
                state.items = state.items.filter(item => item._id !== id);
                state.totalQuantity--;
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
        },
        removeCartItem(state, action) {
            const _id = action.payload;
            console.log(action.payload, current(state));
            const existingItem = state.items.find(item => item._id === _id);
            state.totalQuantity -= existingItem.quantity;
            state.items = state.items.filter(item => item._id !==_id);
        },
        showCartPopup(state, action) {
            if (action.payload) {
                state.isShowCart = true;
            } else {
                state.isShowCart = false;
            }
        }
    }
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;