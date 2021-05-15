import React, {Component} from "react";
import "./index.css";

export default class Cart extends Component {

    render() {
        return (
            <div className="card outlined my-16 mr-25 flex-30">
                <section className="layout-row align-items-center justify-content-center px-16">
                    <h4>Your Cart</h4>
                </section>
                <div className="divider"/>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Item</th>
                        <th className="numeric">Quantity</th>
                        <th className="numeric">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.cart.items.map((cartItem, idx) => {
                            return (
                                <tr data-testid={'cart-item-' + idx}
                                    key={idx + 1}
                                    className="slide-up-fade-in">
                                    <td>{idx + 1}.</td>
                                    <td className="name" data-testid="cart-item-name">{cartItem.item}</td>
                                    <td className="numeric quantity" data-testid="cart-item-quantity">
                                        {cartItem.quantity}
                                    </td>
                                    <td className="numeric quantity" data-testid="cart-item-price">
                                        {cartItem.price}
                                    </td>
                                </tr>
                            )
                        })
                    }

                    </tbody>
                </table>
                <div className="layout-row justify-content-between align-items-center px-8 mx-12">
                    <h5>Select Coupon</h5>
                    <select data-testid="cart-coupon"
                            className="coupon-select">
                        <option value="0">None</option>
                        <option value="10">OFF10</option>
                        <option value="20">OFF20</option>
                    </select>
                </div>
                <ul className="bordered inset ma-0 px-8 mt-30">
                    <li className="layout-row justify-content-between py-12 caption font-weight-light">
                        <span>Subtotal</span>
                        <span data-testid="cart-subtotal">${this.props.cart.subTotal}</span>
                    </li>
                    <li className="layout-row justify-content-between py-12 caption font-weight-light">
                        <span>Discount (-)</span>
                        <span className="discount" data-testid="cart-discount">${this.props.cart.discount}</span>
                    </li>
                    <li className="layout-row justify-content-between py-12 font-weight-bold">
                        <span>Total</span>
                        <span data-testid="cart-total">${this.props.cart.totalPrice}</span>
                    </li>
                </ul>
            </div>

        );
    }
}
