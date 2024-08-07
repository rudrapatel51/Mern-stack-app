import React from 'react';

const categories = [
  { name: 'For Women', products: 3495, image: 'https://images.unsplash.com/photo-1644955480791-facd292ca5dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'For Men', products: 2847, image: 'https://plus.unsplash.com/premium_photo-1687989650785-7edeaaddc7a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'For Kids', products: 385, image: 'https://plus.unsplash.com/premium_photo-1661727681674-a03e54baddbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Accessories', products: 2483, image: 'https://plus.unsplash.com/premium_photo-1672883552384-087b8a7acdb6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const PopularCategories = () => {
  return (
    <div className="container mx-auto p-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Popular Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <div key={category.name} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <div className="absolute inset-0  flex flex-col justify-between p-4">
              <div>
                <h3 className="text-Black text-lg md:text-xl font-bold">{category.name}</h3>
                <p className="text-Black text-xs md:text-sm">{category.products} Products</p>
              </div>
              <button className="bg-black w-32 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm mt-2 hover:bg-gray-800 transition-colors duration-300">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;