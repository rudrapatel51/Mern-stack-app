import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { removeFromCart, updateQuantity } from '../cart/redux/cartSlice';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems = [], totalAmount, totalQuantity } = useSelector(state => state.cart);
  console.log(cartItems)
  const dispatch = useDispatch();
  const { isCartOpen, closeCart } = useCart();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart({ id }));
  };

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <section className={`fixed inset-0 z-10 overflow-hidden ${isCartOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeCart} />

      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform transition bg-white shadow-xl">
            <div className="flex h-full flex-col overflow-y-scroll">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart ({totalQuantity} items)</h2>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  >
                    <MdClose aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.length > 0 ? (
                        cartItems.map((product) => (
                          <li key={product._id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                alt={product.imageAlt}
                                src={product.imageUrl}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{product.name}</h3>
                                <p className="ml-4">${(product.price * product.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(product._id, product.quantity, -1)}
                                    className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="px-4 py-1 bg-gray-100 min-w-[40px] text-center">
                                    {product.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(product._id, product.quantity, 1)}
                                    className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  onClick={() => handleRemoveFromCart(product._id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p className="text-center py-4">Your cart is empty.</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  {/* <p>${totalAmount.toFixed(2)}</p> */}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <a
                    href="/checkout"
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Checkout
                  </a>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={closeCart}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;