import { createSlice, current } from "@reduxjs/toolkit";

let initialItems = [], initialTotalQuantity = 0;

try {
    const itemsStorage = localStorage.getItem('cartItems');
    if (itemsStorage) {
        initialItems = JSON.parse(itemsStorage);
        initialTotalQuantity = initialItems.length;
    }
} catch (err) {
    console.log(err);
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: initialItems,
        finalItems: [],
        totalQuantity: initialTotalQuantity,
        totalPrice: 0,
        finalPrice: 0,
        discount: 0,
        appliedCoupons: [],
        isShowCart: false
    },

    reducers: {
        updateCartItems(state, action) {
            const payload = action.payload;

            if (payload.type === 'booking') {
                // const cartItems = JSON.parse(localStorage.getItem('cartItems'));
                const cloneItems = [...state.items];
                const updatedItems = cloneItems.filter(val1 => !payload.items.find(val2 => val2._id === val1._id));
                state.items = updatedItems;
                state.finalItems = [];
                state.totalQuantity = state.items.length;
                state.discount = 0;
                state.appliedCoupons = [];
                state.totalPrice = state.finalItems.reduce( (curr, item) => { return curr + item.totalPrice; }, 0);
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            } else {
                state.finalItems = payload.updatedItems;
                state.totalQuantity = payload.updatedItems.length;
                state.totalPrice = state.finalItems.reduce( (curr, item) => { return curr + item.totalPrice; }, 0);

                // if (payload.updatedItems.length === 0) {
                //     state.items = [];
                //     localStorage.removeItem('cartItems'); // empty cart
                // }
            }
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
                    const existingFinalItem = state.finalItems.findIndex(val => val._id === updatedItem._id);
            
                    state.finalItems = state.finalItems.filter(val => val._id !== updatedItem._id);
                    
                    if (existingFinalItem >= 0 && state.totalPrice > 0) {
                        state.totalPrice -= updatedItem.totalPrice;
                    } 

                    state.discount = 0;
                    state.appliedCoupons = [];

                    // if (state.totalPrice > 0) {
                    //     state.totalPrice -= updatedItem.totalPrice;
                    // }
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
        },
        setAppliedCoupons(state, action) {
            state.appliedCoupons = action.payload;
        },
        setDiscount(state, action) {
            state.discount = action.payload;
        },
        setFinalPrice(state, action) {
            state.finalPrice = action.payload;
        },
        addCoupon(state, action) {
            const appliedCoupons = state.appliedCoupons;
            const item = action.payload;
            const index = appliedCoupons.findIndex(val => val.id === item.id);
            let coupons = [...appliedCoupons, item];

            if (index < 0) { 
                const discountExistIndex = appliedCoupons.findIndex(val => val.type === 'discount');

                if (discountExistIndex >= 0) {
                    if (item.type === 'shipping') {
                        state.appliedCoupons = coupons;
                    } else {
                        coupons.splice(discountExistIndex, 1);
                        state.appliedCoupons = coupons;
                    }
                }
    
                if (appliedCoupons.length < 2) {
                    state.appliedCoupons = coupons;
                }
            } else {
                let updatedCoupons = [...appliedCoupons]
                updatedCoupons.splice(index, 1);
                state.appliedCoupons = updatedCoupons;
            }
        }
    }
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;