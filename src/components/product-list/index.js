import React, {Component} from "react";
import "./index.css";

export default class ProductList extends Component {
    constructor() {
        super();
    }

    render() {

        return (
            <div className="layout-row wrap justify-content-center flex-70 app-product-list">
                {this.props.products.map((product, i) => {
                    return (
                        <section className="w-30"
                                 data-testid={'product-item-' + i}
                                 key={product.id}>
                            <div className="card ma-16">
                                <img alt="Your Cart" src={product.image}
                                     className="d-inline-block align-top product-image"/>
                                <div className="card-text pa-4">
                                    <h5 className="ma-0 text-center">{product.name}</h5>
                                    <p className="ma-0 mt-8 text-center">${product.price}</p>
                                </div>
                                <div className="card-actions justify-content-center pa-4">
                                    <button className="x-small outlined" data-testid="btn-item-add">
                                        Add To Cart
                                    </button>

                                    <button className="x-small danger" data-testid="btn-item-remove">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </section>
                    )
                })}

            </div>

        );
    }
}

