"use client";
import CategoryList from "./component/home/categoryList";
import RangeSelect from "./component/home/rangeSelect";
import SelectRating from "./component/home/selectedRating";
import GoogleMapView from "./component/home/googleMapView";
import React, { useState } from "react";
import HomePage from "./component/home/homePage";

import RestaurantData from "../data/restaurant";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Kategori seçildiğinde çalışacak fonksiyon
  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
  };

  // Seçili kategoriye göre restoranları filtrele
  const filteredRestaurants = selectedCategory
    ? RestaurantData.filter((r) => r.category === selectedCategory)
    : RestaurantData;

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="p-2">
        <CategoryList
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        <RangeSelect />
        <SelectRating />
      </div>
      <div className="col-span-3">
        <HomePage restaurants={filteredRestaurants} />
      </div>
    </div>
  );
}
