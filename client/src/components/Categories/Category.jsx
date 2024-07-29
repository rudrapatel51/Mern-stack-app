import React from 'react';

const Category = () => {
    const CategoryProducts = [
        {
            id: 1,
            name: "Accessories",
            imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
           
        },
        {
            id: 2,
            name: "Bags",
            imageUrl: "https://plus.unsplash.com/premium_photo-1677541205130-51e60e937318?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
           
        },
        {
            id: 3,
            name: "Electronics",
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
            
        },
        {
            id: 4,
            name: "Shoes",
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
            
        },
    ];

    return (
        <div>
            <div className='text-center py-5'>
                <h1 className='text-3xl font-bold py-2'>Shop By Category</h1>
                <p className='text-sm'>There are many variations of categories. Explore them!</p>
            </div>
            <div className='p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {CategoryProducts.map((category) => (
                    <div key={category.id} className='relative group overflow-hidden rounded-lg shadow-lg'>
                        <img src={category.imageUrl} alt={category.name} className='w-full h-64 object-cover transition-transform duration-300 transform group-hover:scale-105' />
                        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center p-4'>
                            <h1 className='text-lg font-bold'>{category.name}</h1>
                        </div>
                    </div>
                ))}
            </div>
                <div className='text-center'>
                <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Explore All Category</button>
                </div>
        </div>
    );
};

export default Category;
