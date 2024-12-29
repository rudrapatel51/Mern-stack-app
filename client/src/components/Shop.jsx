import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import api from '../axios/axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product, index) => (
            <div
            key={product._id || index}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
              <div className="bg-white p-4 rounded-lg shadow">
                <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs">
                  {product.category}
                </span>
                <img
                  alt={product.imageAlt}
                  src={product.imageUrl}
                  className="w-full h-40 object-fit mb-4"
                />
                <h3 className="font-bold text-2xl">{product.name}</h3>
                <p className="text-gray-600 text-xl font-bold">
                  ${product.price}
                </p>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleAddToCart(product);
                  }}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <Cart /> */}
    </div>
  );
};

export default Shop;