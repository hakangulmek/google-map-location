import React from "react";

function RestaurantCard({ restaurants }: { restaurants: any[] }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <h2 className="text-xl font-semibold mt-2">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.category}</p>
            <p className="text-green-500 font-bold mt-1">
              ${restaurant.priceRange}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantCard;
