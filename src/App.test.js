import React from 'react';
import App, {PRODUCTS} from './App';
import {render, fireEvent, cleanup, within} from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';


const renderApp = () => render(<App/>);

afterEach(() => {
    cleanup()
});

const IDMAPS = {
    ADD_TO_CART_BTN: 'btn-item-add',
    REMOVE_FROM_CART_BTN: 'btn-item-remove',
    CART_COUPON_SELECT: 'cart-coupon',
    CART_ITEM_QUANTITY: 'cart-item-quantity',
    CART_ITEM_NAME: 'cart-item-name',
    PRODUCT_ITEMS: ['product-item-0', 'product-item-1', 'product-item-2', 'product-item-3', 'product-item-4', 'product-item-5'],
    CART_ITEM_PRICE: 'cart-item-price',
    CART_SUBTOTAL: 'cart-subtotal',
    CART_DISCOUNT: 'cart-discount',
    CART_TOTAL: 'cart-total'

}

const addToCart = (item) => {
    const addToCartButton = within(item).getByTestId(IDMAPS.ADD_TO_CART_BTN);
    fireEvent.click(addToCartButton);
}

const removeFromCart = (item) => {
    const removeFromCartButton = within(item).getByTestId(IDMAPS.REMOVE_FROM_CART_BTN);
    fireEvent.click(removeFromCartButton);
}

const getCartItem = (index, getByTestId) => {
    const cartListItem = getByTestId(`cart-item-${index}`)

    const cartItemQuantity = within(cartListItem).getByTestId('cart-item-quantity');
    const cartItemName = within(cartListItem).getByTestId('cart-item-name');
    const cartItemPrice = within(cartListItem).getByTestId('cart-item-price');
    return {
        quantity: cartItemQuantity,
        name: cartItemName.innerHTML,
        price: parseInt(cartItemPrice.innerHTML.replace('$', '')),
        node: cartListItem.innerHTML
    }
}

const getCartDetails = (getByTestId) => {
    return {
        subTotal: parseInt(getByTestId(IDMAPS.CART_SUBTOTAL).innerHTML.replace('$', '')),
        discount: parseInt(getByTestId(IDMAPS.CART_DISCOUNT).innerHTML.replace('$', '')),
        total: parseInt(getByTestId(IDMAPS.CART_TOTAL).innerHTML.replace('$', '')),
    };
}

const getDiscountValue = (product, value) => {
    return (value / 100) * product.price;
}

const pushDiscountValue = (value, getByTestId) => {
    const couponSelect = getByTestId(IDMAPS.CART_COUPON_SELECT);
    couponSelect.value = value;
    fireEvent.change(couponSelect, {
        target: {value}
    });
};


test('Should Add item to cart', async () => {
    let addToCartButton, removeFromCartBtn, item;
    const {
        queryByTestId
    } = renderApp();
    expect(queryByTestId('cart-item-0')).toBeNull();
    item = queryByTestId(IDMAPS.PRODUCT_ITEMS[1]);
    let utils = within(item);

    addToCartButton = utils.getByTestId(IDMAPS.ADD_TO_CART_BTN);
    removeFromCartBtn = utils.queryByTestId(IDMAPS.REMOVE_FROM_CART_BTN);

    expect(removeFromCartBtn).toBeFalsy();
    expect(addToCartButton).toBeTruthy();

    fireEvent.click(addToCartButton);

    addToCartButton = utils.queryByTestId(IDMAPS.ADD_TO_CART_BTN);
    removeFromCartBtn = utils.getByTestId(IDMAPS.REMOVE_FROM_CART_BTN);
    expect(removeFromCartBtn).toBeTruthy();
    expect(addToCartButton).toBeFalsy();

    const cartItem = queryByTestId('cart-item-0');
    expect(cartItem).toBeTruthy();

    utils = within(cartItem);
    expect(utils.getByTestId(IDMAPS.CART_ITEM_QUANTITY).innerHTML).toEqual('1');
    expect(utils.getByTestId(IDMAPS.CART_ITEM_NAME).innerHTML).toEqual('Hand Bag - $30');
});

test('Should Calculate correct price before selecting coupon', () => {
    let cartItem, cartDetails;
    const {
        queryByTestId,
        getByTestId
    } = renderApp();

    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[1]));
    cartItem = getCartItem(0, getByTestId);

    expect(cartItem.price).toEqual(PRODUCTS[1].price);

    cartDetails = getCartDetails(getByTestId);

    expect(cartDetails.subTotal).toEqual(cartDetails.total);
    expect(cartDetails.discount).toEqual(0);
    expect(cartDetails.total).toEqual(PRODUCTS[1].price);

    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[2]));
    cartItem = getCartItem(1, getByTestId);
    expect(cartItem.price).toEqual(PRODUCTS[2].price);

    cartDetails = getCartDetails(getByTestId);
    expect(cartDetails.discount).toEqual(0);
    expect(cartDetails.total).toEqual(PRODUCTS[1].price + PRODUCTS[2].price);
})

test('Should calculate discounts on selecting a coupon', () => {
    let cartDetails;
    const {
        queryByTestId,
        getByTestId
    } = renderApp();
    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[3]));
    pushDiscountValue('10', getByTestId);
    cartDetails = getCartDetails(getByTestId);
    let calculatedDiscount = getDiscountValue(PRODUCTS[3], 10);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.subTotal).toEqual(PRODUCTS[3].price);
    expect(cartDetails.total).toEqual(PRODUCTS[3].price - calculatedDiscount);
})

test('Should recalculate prices when item is removed from cart', () => {
    let cartDetails;
    const {
        queryByTestId,
        getByTestId
    } = renderApp();
    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[2]));
    pushDiscountValue('20', getByTestId);
    cartDetails = getCartDetails(getByTestId);
    let calculatedDiscount = getDiscountValue(PRODUCTS[2], 20);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.subTotal).toEqual(PRODUCTS[2].price);
    expect(cartDetails.total).toEqual(PRODUCTS[2].price - calculatedDiscount);

    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[3]));
    cartDetails = getCartDetails(getByTestId);
    calculatedDiscount += getDiscountValue(PRODUCTS[3], 20);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.total).toEqual((PRODUCTS[3].price + PRODUCTS[2].price) - calculatedDiscount);

    removeFromCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[2]))
    cartDetails = getCartDetails(getByTestId);
    calculatedDiscount -= getDiscountValue(PRODUCTS[2], 20);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.total).toEqual((PRODUCTS[3].price) - calculatedDiscount);
})

test('Should recalculate prices when coupon is changed', () => {
    let cartDetails;
    const {
        queryByTestId,
        getByTestId
    } = renderApp();
    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[2]));
    pushDiscountValue('20', getByTestId);
    cartDetails = getCartDetails(getByTestId);
    let calculatedDiscount = getDiscountValue(PRODUCTS[2], 20);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.subTotal).toEqual(PRODUCTS[2].price);
    expect(cartDetails.total).toEqual(PRODUCTS[2].price - calculatedDiscount);

    addToCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[3]));
    cartDetails = getCartDetails(getByTestId);
    calculatedDiscount += getDiscountValue(PRODUCTS[3], 20);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.total).toEqual((PRODUCTS[3].price + PRODUCTS[2].price) - calculatedDiscount);

    removeFromCart(queryByTestId(IDMAPS.PRODUCT_ITEMS[2]))
    cartDetails = getCartDetails(getByTestId);
    calculatedDiscount -= getDiscountValue(PRODUCTS[2], 20);
    expect(cartDetails.discount).toEqual(calculatedDiscount);
    expect(cartDetails.total).toEqual((PRODUCTS[3].price) - calculatedDiscount);

    pushDiscountValue('0', getByTestId);
    cartDetails = getCartDetails(getByTestId);
    expect(cartDetails.subTotal).toEqual((PRODUCTS[3].price));
    expect(cartDetails.discount).toEqual(0);
    expect(cartDetails.total).toEqual((PRODUCTS[3].price));
})
