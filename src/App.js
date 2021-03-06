import React, { Component } from "react";
import "./App.css";
import ProductList from "./components/product-list";
import Cart from "./components/cart";
import "h8k-components";

const title = "AkweteyShop";

class App extends Component {
  constructor() {
    super();
    const products = [...PRODUCTS].map((product, index) => {
      product.id = index + 1;
      product.image = `/images/items/${product.name.toLocaleLowerCase()}.png`;
      product.cartQuantity = 0;
      product.showBtn = false;
      return product;
    });
    this.state = {
      cart: {
        items: [],
        subTotal: 0,
        totalPrice: 0,
        discount: 0,
        selectedCoupon: "0",
      },
      products,
      subTotal: 0,
    };
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.calculateSubTotal = this.calculateSubTotal.bind(this);
  }

  addToCart(e, index) {
    const products = this.state.products;
    products[index].cartQuantity = 1;
    products[index].showBtn = true;
    let cart = { ...this.state.cart };
    cart.items.push({
      id: products[index].id,
      price: products[index].price,
      item: products[index].heading,
      quantity: 1,
    });
    this.setState({
      products,
      cart,
    });
    this.calculateSubTotal();
  }

  removeFromCart(e, index) {
    const products = this.state.products;
    products[index].cartQuantity = 0;
    products[index].showBtn = false;
    let cart = { ...this.state.cart };
    let cartIndex = this.state.cart.items.findIndex(
      (item) => item.id === products[index].id
    );
    cart.items.splice(cartIndex, 1);
    this.setState({
      cart,
      products,
    });
    this.calculateSubTotal();
  }

  calculateSubTotal() {
    let price = this.state.cart.items.reduce((acc, val) => {
      return acc + val.price;
    }, 0);
    this.setState({
      subTotal: price,
    });
  }

  render() {
    return (
      <div>
        <h8k-navbar header={title}></h8k-navbar>
        <div className="layout-row shop-component">
          <ProductList
            products={this.state.products}
            addToCart={this.addToCart}
            removeFromCart={this.removeFromCart}
          />
          <Cart
            cart={this.state.cart}
            calculateSubTotal={this.state.subTotal}
          />
        </div>
      </div>
    );
  }
}

export const PRODUCTS = [
  {
    heading: "Cap - $10",
    name: "Cap",
    price: 10,
  },
  {
    heading: "Hand Bag - $30",
    name: "HandBag",
    price: 30,
  },
  {
    heading: "Shirt - $30",
    name: "Shirt",
    price: 30,
  },
  {
    heading: "Shoes - $50",
    name: "Shoe",
    price: 50,
  },
  {
    heading: "Pant - $40",
    name: "Pant",
    price: 40,
  },
  {
    heading: "Slipper - $20",
    name: "Slipper",
    price: 20,
  },
];
export default App;
